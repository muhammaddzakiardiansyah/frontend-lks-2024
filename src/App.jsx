import { Route, Routes } from "react-router-dom"
import LoginPage from "./pages/Auth/LoginPage"
import DashboardPage from "./pages/Dashboard/DashboardPage"
import CreateForm from "./pages/Dashboard/CreateForm"
import DetailForm from "./pages/Dashboard/DetailForm"
import PrivateRoute from "./components/PrivateRoute"

function App() {

  return (
    <Routes>
      <Route exact path="/login" element={<LoginPage/>} />
      <Route exact path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
      <Route exact path="/create-form" element={<PrivateRoute><CreateForm /></PrivateRoute>} />
      <Route exact path="/forms/:slug" element={<PrivateRoute><DetailForm /></PrivateRoute>} />
    </Routes>
  )
}

export default App
