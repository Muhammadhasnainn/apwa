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

function App() {
  const [count, setCount] = useState(0);

  return (
      <div>
        
        <Routes>
          <Route exact path="/" element={<Signin/>}> </Route>
          <Route exact path="/dashboard" element={<Dashboard/>}> </Route>
          <Route exact path="/POS" element={<Pos/>}> </Route>
          <Route exact path="/addproduct" element={<Add_product/>}> </Route>
          <Route exact path="/addcategory" element={<Add_catogery/>}> </Route>
          <Route exact path="/viewproducts" element={<ViewProducts/>}> </Route>
          <Route exact path="/addpurchase" element={<Add_purchase/>}> </Route>
          <Route exact path="/viewpurchase" element={<Viewpurchase/>}> </Route>
          <Route exact path="/viewcategories" element={<ViewCategories/>}> </Route>

          <Route exact path="/viewpos" element={<ViewPOS/>}> </Route>


          <Route exact path="*" element={<h1>404</h1>}> </Route>

            
         
          
        </Routes>
        
      </div>
  );
}

export default App;
