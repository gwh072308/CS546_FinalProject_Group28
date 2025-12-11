// routes/index.js
// Central route configuration using constructor pattern
// All route modules are mounted here for centralized management

import arrestsRoutes from './arrests.js';
import usersRoutes from './users.js';
import commentsRoutes from './comments.js';
import trendsRoutes from './trends.js';
import helpRoutes from './help.js'; // Import help routes
import statsRoutes from './stats.js'; // Import stats routes

const constructorMethod = (app) => {
  // Home route
  app.get('/', (req, res) => {
    res.render('home', {
      title: 'NYC Arrest Data Visualization'
    });
  });

  // Demographic Insights route
  app.get('/demographics', (req, res) => {
    res.render('demographicInsights', {
      title: 'Demographic Insights',
      user: req.session.user || null
    });
  });

  // Mount feature routes
  app.use('/arrests', arrestsRoutes);
  app.use('/users', usersRoutes);
  app.use('/comments', commentsRoutes);
  app.use('/trends', trendsRoutes);
  app.use('/help', helpRoutes); // for Help and FAQ page 
  app.use('/stats', statsRoutes); // for Statistical Dashboard page

  // 404 handler - must be last
  // Note: This will be caught by notFoundHandler middleware in app.js
  app.use('*', (req, res) => {
    res.status(404).json({error: 'Route not found'});
  });
};

export default constructorMethod;