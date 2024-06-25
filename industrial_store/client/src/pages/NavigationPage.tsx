import { Link } from 'react-router-dom';
import { Typography, List, ListItem, ListItemText } from '@mui/material';

const NavigationPage = () => {
  return (
    <div className="container mx-auto py-8">
      <Typography variant="h4" gutterBottom>
        Выберите страницу:
      </Typography>
      <List component="ul">
        <ListItem component="li" className="mb-2">
          <Link to="/categories" className="text-blue-600 hover:underline">
            <ListItemText primary="Управление категориями" />
          </Link>
        </ListItem>
        <ListItem component="li" className="mb-2">
          <Link to="/products" className="text-blue-600 hover:underline">
            <ListItemText primary="Управление товарами" />
          </Link>
        </ListItem>
        <ListItem component="li" className="mb-2">
          <Link to="/supplies" className="text-blue-600 hover:underline">
            <ListItemText primary="Управление поставками" />
          </Link>
        </ListItem>
        <ListItem component="li" className="mb-2">
          <Link to="/manufacturers" className="text-blue-600 hover:underline">
            <ListItemText primary="Управление производителями" />
          </Link>
        </ListItem>
        <ListItem component="li" className="mb-2">
          <Link to="/suppliers" className="text-blue-600 hover:underline">
            <ListItemText primary="Управление поставщиками" />
          </Link>
        </ListItem>
        <ListItem component="li" className="mb-2">
          <Link to="/buyers" className="text-blue-600 hover:underline">
            <ListItemText primary="Управление покупателями" />
          </Link>
        </ListItem>
        <ListItem component="li" className="mb-2">
          <Link to="/sellers" className="text-blue-600 hover:underline">
            <ListItemText primary="Управление продавцами" />
          </Link>
        </ListItem>
        <ListItem component="li" className="mb-2">
          <Link to="/sales" className="text-blue-600 hover:underline">
            <ListItemText primary="Управление продажами" />
          </Link>
        </ListItem>
        <ListItem component="li" className="mb-2">
          <Link to="/schedules" className="text-blue-600 hover:underline">
            <ListItemText primary="График смен продавцов" />
          </Link>
        </ListItem>
        <ListItem component="li" className="mb-2">
          <Link to="/salaries" className="text-blue-600 hover:underline">
            <ListItemText primary="Зарплаты продавцов" />
          </Link>
        </ListItem>
      </List>
    </div>
  );
};

export default NavigationPage;
