import './index.css';
import React from 'react';
import { createBrowserRouter, RouterProvider, Route, Outlet, createRoutesFromElements } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import Header from './components/navigation/Header';
import HomePage from './pages/HomePage';
import ExplorerPage from './pages/ExplorerPage';
import BlockchainPage from './pages/BlockchainPage';
import TransactionsPage from './pages/TransactionsPage';
import SingleTransactionPage from './pages/SingleTransactionPage';
import AddressPage from './pages/AddressPage';

const Layout = () => {
  return (
    <div className="h-screen">
      <Header />
      <Outlet />
    </div>
  );
};

const router = createBrowserRouter(createRoutesFromElements(
    <Route element={<Layout />}>
      <Route path="/" element={<HomePage />} />
      <Route path="explorer" element={<ExplorerPage />} />
      <Route path="blockchain" element={<BlockchainPage />} />
      <Route path="transactions" element={<TransactionsPage />} />
      <Route path="singleTxn" element={<SingleTransactionPage />} />
      <Route path="userAddress" element={<AddressPage />} />
    </Route>
));

// const router = createBrowserRouter([
//   {
//     // path: "/",
//     element: <Layout />,
//     children: [
//       {
//         path: "/",
//         element: <HomePage />,
//       },
//       {
//         path: "/blocks",
//         element: <BlocksPage />,
//       },
//       {
//         path: "/transactions",
//         element: <TransactionsPage />,
//       }
//     ]
//   },
// ])

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>

);



  // <Provider store={store}>
  //   <App />
  // </Provider>