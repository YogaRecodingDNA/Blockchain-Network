import './index.css';
import React from 'react';
import { createBrowserRouter, RouterProvider, Route, Outlet, createRoutesFromElements } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import Header from './components/navigation/Header';
import HomePage from './pages/HomePage';
import AllPeersPage from './pages/AllPeersPage';
import PeerInfoPage from './pages/PeerInfoPage';
import ExplorerPage from './pages/ExplorerPage';
import BlockchainPage from './pages/BlockchainPage';
import SingleBlockPage from './pages/SingleBlockPage';
import TransactionsPage from './pages/TransactionsPage';
import SingleTransactionPage from './pages/SingleTransactionPage';
import TransactionsForBlockPage from './pages/TransactionsForBlockPage';
import AddressPage from './pages/AddressPage';
import FaucetPage from './pages/FaucetPage';

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
      <Route path="peers" element={<AllPeersPage />} />
      <Route path="peers/details" element={<PeerInfoPage />} />
      <Route path="explorer" element={<ExplorerPage />} />
      <Route path="blockchain" element={<BlockchainPage />} />
      <Route path="singleBlock" element={<SingleBlockPage />} />
      <Route path="transactions" element={<TransactionsPage />} />
      <Route path="singleTxn" element={<SingleTransactionPage />} />
      <Route path="blockTxns" element={<TransactionsForBlockPage />} />
      <Route path="userAddress" element={<AddressPage />} />
      <Route path="faucet" element={<FaucetPage />} />
    </Route>
));

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>

);