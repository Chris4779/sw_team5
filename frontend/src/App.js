import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthForm from './components/LoginComponent/AuthForm';
import MainScreen from './screens/MainScreen/MainScreen';
import UploadArticle from './screens/UploadArticleScreen/UploadArticle';
import PrivateRoute from './components/Routes/PrivateRoute';
import PublicRoute from './components/Routes/PublicRoute';


//pull bozo test
//pull pato test2
const App = () => {
  return (
      <Router>
            <Routes>
                {/* Public Route (Login Screen) */}
                <Route
                    path="/"
                    element={
                        <PublicRoute>
                            <AuthForm />
                        </PublicRoute>
                    }
                />
                {/* Private Route (Main Screen) */}
                <Route
                    path="/home"
                    element={
                        <PrivateRoute>
                            <MainScreen />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/uploadarticle"
                    element={
                        <PrivateRoute>
                            <UploadArticle />
                        </PrivateRoute>
                    }
                />

            </Routes>
      </Router>
  );
};

export default App;