// import React, { useState, useEffect } from "react";
// import { isAuthenticated } from "../auth";
// import { listOrders, getStatusValues, updateOrderStatus } from "./apiAdmin";


// const Status = () => {
//   const [orders, setOrders] = useState([]);
//   const [statusValues, setStatusValues] = useState([]);
//   const { user, token } = isAuthenticated();

//   const loadOrders = () => {
//     listOrders(user._id, token).then((data) => {
//       if (data.error) {
//         console.log(data.error);
//       } else {
//         setOrders(data);
//       }
//     });
//   };

//   const loadStatusValues = () => {
//     getStatusValues(user._id, token).then((data) => {
//       if (data.error) {
//         console.log(data.error);
//       } else {
//         setStatusValues(data);
//       }
//     });
//   };

//   useEffect(() => {
//     loadOrders();
//     loadStatusValues();
//   }, []);

//   const showOrdersLength = () => {
//     if (orders.length > 0) {
//       return <h4 className=" display-2">Total orders: {orders.length}</h4>;
//     } else {
//       return <h4 className="text-danger">No orders</h4>;
//     }
//   };

//   const handleStatusChange = (e, orderId) => {
//     updateOrderStatus(user._id, token, orderId, e.target.value).then((data) => {
//       if (data.error) {
//         console.log("Status update failed");
//       } else {
//         loadOrders();
//       }
//     });
//   };

//   const showStatus = (o) => (
//     <div className="form-group">
//       <h3 className="mark mb-4">{o.status}</h3>
//       <select
//         className="form-control"
//         onChange={(e) => handleStatusChange(e, o._id)}
//       >
//         <option>Update Status</option>
//         {statusValues.map((status, index) => (
//           <option key={index} value={status}>
//             {status}
//           </option>
//         ))}
//       </select>
//     </div>
//   );

//   return (
//     <div>
//       {showOrdersLength()}
//       {orders.map((o, oIndex) => {
//         return (
//           <div key={oIndex}>
//             <p>{showStatus(o)}</p>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default Status;
