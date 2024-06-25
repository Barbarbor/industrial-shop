import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, List, ListItem, ListItemText } from '@mui/material';

const NavPanel = () => {
  return (
    <AppBar position="static">
      <Toolbar className="flex justify-between">
        <Typography variant="h6">
          Магазин промышленных товаров
        </Typography>
        <List component="nav" className="flex space-x-4">
          <ListItem component="li">
            <Link to="/categories" className="text-white hover:underline">
              <ListItemText primary="Категории" />
            </Link>
          </ListItem>
          <ListItem component="li">
            <Link to="/products" className="text-white hover:underline">
              <ListItemText primary="Товары" />
            </Link>
          </ListItem>
          <ListItem component="li">
            <Link to="/supplies" className="text-white hover:underline">
              <ListItemText primary="Поставки" />
            </Link>
          </ListItem>
          <ListItem component="li">
            <Link to="/manufacturers" className="text-white hover:underline">
              <ListItemText primary="Производители" />
            </Link>
          </ListItem>
          <ListItem component="li">
            <Link to="/suppliers" className="text-white hover:underline">
              <ListItemText primary="Поставщики" />
            </Link>
          </ListItem>
          <ListItem component="li">
            <Link to="/buyers" className="text-white hover:underline">
              <ListItemText primary="Покупатели" />
            </Link>
          </ListItem>
          <ListItem component="li">
            <Link to="/sellers" className="text-white hover:underline">
              <ListItemText primary="Продавцы" />
            </Link>
          </ListItem>
          <ListItem component="li">
            <Link to="/sales" className="text-white hover:underline">
              <ListItemText primary="Продажи" />
            </Link>
          </ListItem>
          <ListItem component="li">
            <Link to="/schedules" className="text-white hover:underline">
              <ListItemText primary="Расписание" />
            </Link>
          </ListItem>
          <ListItem component="li">
            <Link to="/salaries" className="text-white hover:underline">
              <ListItemText primary="Зарплаты" />
            </Link>
          </ListItem>
        </List>
      </Toolbar>
    </AppBar>
  );
};

export default NavPanel;
