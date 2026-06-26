// src/components/MenuLateral.jsx
import { Link } from 'react-router-dom';
import './MenuLateral.css';

function MenuLateral() {
  return (
    <nav className="menu-lateral">
      <h2>🏨 Hotel SAA</h2>
      <ul>
        <li><Link to="/hospedes">👥 Hóspedes</Link></li>
        <li><Link to="/quartos">🛏️ Quartos</Link></li>
      </ul>
    </nav>
  );
}

export default MenuLateral;