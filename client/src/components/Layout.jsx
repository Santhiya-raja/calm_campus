import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <main className="pt-20 pb-10 px-4">
        <Outlet />
      </main>
    </div>
  );
}
