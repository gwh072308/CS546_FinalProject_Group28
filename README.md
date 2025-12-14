# NYC Arrest Data Visualization and Analysis System

CS-546 Web Programming - Final Project  
**Group 28**

## Team Members
- Wenhui Gao
- Ren Li
- Nageshwaran Manikumar
- Shravani Pranay Sawant
- Ao Wang

## Project Description
An interactive web application that visualizes and analyzes NYC arrest data from the NYPD Open Data portal. Users can explore arrest patterns across time, geography, and demographics through various visualization tools and filtering options.

## GitHub Repository
**Link**: https://github.com/gwh072308/CS546_FinalProject_Group28

## Technologies Used
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Template Engine**: Handlebars
- **Frontend**: HTML, CSS, JavaScript, jQuery
- **Data Visualization**: Chart.js
- **Authentication**: bcrypt, express-session
- **Security**: XSS protection
- **PDF Generation**: pdf-lib

## Features

### Core Features
1. Browse arrest records with pagination
2. Search and filter by multiple criteria
3. Detailed arrest record view
4. Statistical dashboard
5. Demographic insights and analysis
6. Time-series trend visualization
7. Crime category ranking
8. User authentication and comments

### Extra Features
- CSV/PDF data export
- Dark/Light mode toggle
- Help & FAQ page

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v6 or higher)

### Setup Instructions

1. Clone the repository
```bash
git clone https://github.com/gwh072308/CS546_FinalProject_Group28.git
cd CS546_FinalProject_Group28
```

2. Install dependencies
```bash
npm install
```

3. Start MongoDB
```bash
# On macOS with Homebrew
brew services start mongodb-community

# Or manually
mongod
```

4. Seed the database
```bash
npm run seed
```

This will:
- Fetch 212,486 arrest records from NYC Open Data API
- Perform stratified sampling (400 records per borough)
- Clean and transform the data
- Insert 2,000 representative records into MongoDB
- Create test user accounts
- Seed sample comments

5. Start the application
```bash
npm start
```

6. Open your browser and navigate to
```
http://localhost:3000
```

## Test User Accounts

For testing purposes, the following accounts are created during seeding:

- **Username**: `testuser` / **Password**: `Password123@`
- **Username**: `admin` / **Password**: `Admin123&`



## Usage Guide

### Browsing Arrests
- Navigate to "Browse Arrests" to view all arrest records
- Use pagination controls to browse through pages (50 records per page)
- Click on any arrest card to view detailed information

### Searching and Filtering
- Use the search bar to find arrests by offense description
- Access advanced filters to narrow results by:
  - Borough (Manhattan, Brooklyn, Queens, Bronx, Staten Island)
  - Age Group (Under 18, 18-24, 25-44, 45-64, 65+)
  - Gender
  - Race
  - Offense Type

### Viewing Statistics
- **Statistical Dashboard**: View overall statistics and charts
- **Demographic Insights**: Analyze patterns by age, gender, and race
- **Time-Series Trends**: Explore arrest patterns over time (monthly/weekly)
- **Crime Ranking**: See the top 10 most frequent offense types

### Exporting Data
- Filter arrests using the advanced filter
- Click "Export to CSV" for spreadsheet format
- Click "Export to PDF" for printable reports

### User Features
- Register for an account (requires strong password)
- Log in to access commenting features
- Add comments to individual arrest records
- Delete your own comments

## Data Source
- **Dataset**: NYPD Arrest Data (Year to Date)
- **Provider**: NYC Open Data
- **URL**: https://data.cityofnewyork.us/Public-Safety/NYPD-Arrest-Data-Year-to-Date-/uip8-fykc
- **Records Processed**: 212,486
- **Records in Database**: 2,000 (stratified sample)

## Security Features
- Password hashing with bcrypt (10 salt rounds)
- XSS input sanitization on all user inputs
- Client-side, server-side, and database-level input validation
- Session-based authentication with HTTP-only cookies
- Protected routes requiring authentication

## Browser Compatibility
- Chrome (recommended)
- Firefox
- Safari
- Edge

## Known Issues
None at this time.


## License
This project is for educational purposes as part of CS-546 coursework at Stevens Institute of Technology.

## Acknowledgments
- NYC Open Data for providing the arrest dataset
- Stevens Institute of Technology CS-546 Course Staff
- Chart.js community for visualization library
- All team members for their contributions

---

**Last Updated**: December 2025
**Course**: CS-546 Web Programming I  
**Semester**: Fall 2025