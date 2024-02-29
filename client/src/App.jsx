import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState } from 'react';

import './App.css';
import Signin from './page/Sign_in';
import Sign_up from './page/Sign_up';
import { Navbar } from './components/Navbar';
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

function App() {
  const [count, setCount] = useState(0);

  return (
      <div>
        
        <Routes>
          <Route exact path="/" element={<Signin/>}> </Route>
          <Route exact path="/dashboard" element={<ProtectedRoute> <Dashboard/> </ProtectedRoute>}> </Route>
          <Route exact path="/POS" element={<ProtectedRoute> <Pos/> </ProtectedRoute>}> </Route>
          <Route exact path="/addproduct" element={<ProtectedRoute> <Add_product/> </ProtectedRoute>}> </Route>
          <Route exact path="/addcategory" element={<ProtectedRoute> <Add_catogery/> </ProtectedRoute>}> </Route>
          <Route exact path="/viewproducts" element={<ProtectedRoute> <ViewProducts/> </ProtectedRoute>}> </Route>
          <Route exact path="/addpurchase" element={<ProtectedRoute> <Add_purchase/> </ProtectedRoute>}> </Route>
          <Route exact path="/viewpurchase" element={<ProtectedRoute> <Viewpurchase/> </ProtectedRoute>}> </Route>
          <Route exact path="/viewcategories" element={<ProtectedRoute> <ViewCategories/> </ProtectedRoute>}> </Route>

          <Route exact path="/viewpos" element={<ProtectedRoute> <ViewPOS/> </ProtectedRoute>}> </Route>


          <Route exact path="*" element={<h1>404</h1>}> </Route>

            
         
          
        </Routes>
        
      </div>
  );
}

export default App;
