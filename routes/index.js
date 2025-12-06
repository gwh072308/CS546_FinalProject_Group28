// routes/index.js
// Central route configuration using constructor pattern
// All route modules are mounted here for centralized management

import arrestsRoutes from './arrests.js';
import usersRoutes from './users.js';
import commentsRoutes from './comments.js';

const constructorMethod = (app) => {
  // Home route
  app.get('/', (req, res) => {
    res.render('home', {
      title: 'NYC Arrest Data Visualization'
    });
  });

  // Mount feature routes
  app.use('/arrests', arrestsRoutes);
  app.use('/users', usersRoutes);
  app.use('/comments', commentsRoutes);

  // 404 handler - must be last
  // Note: This will be caught by notFoundHandler middleware in app.js
  app.use('*', (req, res) => {
    res.status(404).json({error: 'Route not found'});
  });
};

export default constructorMethod;