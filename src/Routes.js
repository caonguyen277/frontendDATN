import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Signup from "./user/Signup";
import Signin from "./user/Signin";
import Home from "./core/Home";
import PrivateRoute from "./auth/PrivateRoute";
import Dashboard from "./user/UserDashboard";
import AdminRoute from "./auth/AdminRoute";
import AdminDashboard from "./user/AdminDashboard";
import AddCategory from "./admin/AddCategory";
import AddBranch from "./admin/AddBranch";
import AddProduct from "./admin/AddProduct";
import Shop from "./core/Shop";
import Product from "./core/Product";
import Cart from "./core/Cart";
import Favourite from "./core/Favourite"
import Orders from "./admin/Orders";
import Profile from "./user/Profile";
import OrderByUser from "./user/OrderByUser";
import ManageProducts from "./admin/ManageProducts";
import UpdateProduct from "./admin/UpdateProduct";
import ManageCategories from "./admin/ManaCategory";
import UpdateCategory from "./admin/UpdateCate"
import ManageBranches from "./admin/ManaBranch";
import UpdateBranch from "./admin/UpdateBranch";
import ManagerComments from "./admin/ManagerComments";
import ManagerCommentTitle from "./admin/ManagerCommentTitle";
import Statistical from "./admin/Statistical";
import PageNotFound from "./core/notFound";
const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/shop" exact component={Shop} />
        <Route path="/signin" exact component={Signin} />
        <Route path="/signup" exact component={Signup} />
        <PrivateRoute path="/user/dashboard" exact component={Dashboard} />
        <PrivateRoute path="/user/orders" exact component={OrderByUser} />
        <AdminRoute path="/admin/dashboard" exact component={AdminDashboard} />
        <AdminRoute path="/create/category" exact component={AddCategory} />
        <AdminRoute path="/create/branch" exact component={AddBranch} />
        <AdminRoute path="/create/product" exact component={AddProduct} />
        <Route path="/product/:productId" exact component={Product} />
        <Route path="/cart" exact component={Cart} />
        <Route path="/favourite" exact component={Favourite} />
        <AdminRoute path="/admin/orders" exact component={Orders} />
        <PrivateRoute path="/profile/:userId" exact component={Profile} />
        <PrivateRoute path="/admin/products" exact component={ManageProducts} />
        <PrivateRoute path="/admin/branches" exact component={ManageBranches} />
        <AdminRoute
          path="/admin/branch/update/:branchId"
          exact
          component={UpdateBranch}
        />
        <AdminRoute
          path="/admin/product/update/:productId"
          exact
          component={UpdateProduct}
        />
        <AdminRoute
          path="/admin/categories"
          exact
          component={ManageCategories}
        />
        <AdminRoute
          path="/admin/comments"
          exact
          component={ManagerComments}
        />
        <AdminRoute
          path="/admin/commentTitle"
          exact
          component={ManagerCommentTitle}
        />
        <AdminRoute
          path="/admin/statistical"
          exact
          component={Statistical}
        />
        <AdminRoute path="/admin/category/update/:categoryId" exact component={UpdateCategory} />
        <Route path="" component={PageNotFound} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
