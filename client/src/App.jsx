import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import './App.css';
import Signin from './page/Sign_in';
import Dashboard from './page/dashboard';
import Pos from './page/Pos';
import Add_product from './page/Add_product';
import Add_catogery from './page/add_catogery';
import ViewProducts from './page/ViewProducts';
import Add_purchase from './page/add_purchase';
import Viewpurchase from './page/ViewPurchase';
import ViewPOS from './page/ViewPos';
import ViewCategories from './page/ViewCategories';
import ProtectedRoute from "./Context/ProtectedRoute"
import Return from './page/Return';
import Preview from './page/Preview';
import Returns from './page/Returns';

function App() {
  const [count, setCount] = useState(0);

  return (
      <div>
        
        <Routes>
          <Route exact path="/" element={<Signin/>}> </Route>
          <Route exact path="/dashboard" element={<ProtectedRoute> <Dashboard/> </ProtectedRoute>}> </Route>
          <Route exact path="/POS" element={<ProtectedRoute> <Pos/> </ProtectedRoute>}> </Route>
          <Route exact path="/return/:id" element={<ProtectedRoute><Return /> </ProtectedRoute>}> </Route>
          <Route exact path="/addproduct" element={<ProtectedRoute> <Add_product/> </ProtectedRoute>}> </Route>
          <Route exact path="/addcategory" element={<ProtectedRoute> <Add_catogery/> </ProtectedRoute>}> </Route>
          <Route exact path="/viewproducts" element={<ProtectedRoute> <ViewProducts/> </ProtectedRoute>}> </Route>
          <Route exact path="/addpurchase" element={<ProtectedRoute> <Add_purchase/> </ProtectedRoute>}> </Route>
          <Route exact path="/viewpurchase" element={<ProtectedRoute> <Viewpurchase/> </ProtectedRoute>}> </Route>
          <Route exact path="/viewcategories" element={<ProtectedRoute> <ViewCategories/> </ProtectedRoute>}> </Route>
          <Route exact path="/preview" element={<ProtectedRoute> <Preview /> </ProtectedRoute> }> </Route>
          <Route exact path="/viewpos" element={<ProtectedRoute> <ViewPOS/> </ProtectedRoute>}> </Route>
          <Route exact path="/viewreturns" element={<ProtectedRoute> <Returns/> </ProtectedRoute>}> </Route>

        
        </Routes>
        
      </div>
  );
}

export default App;
