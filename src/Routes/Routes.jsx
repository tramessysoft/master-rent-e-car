import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main";
import Home from "../Pages/Home";
import CarList from "../Pages/CarList";
import AddCarForm from "../Pages/AddCarForm";
import DriverList from "../Pages/DriverList";
import AddDriverForm from "../Pages/AddDriverForm";
import TripList from "../Pages/TripList";
import AddTripForm from "../Pages/AddTripForm";
import Fuel from "../Pages/Fuel";
import FuelForm from "../Pages/FuelForm";
import Parts from "../Pages/Parts";
import Maintenance from "../Pages/Maintenance";
import MaintenanceForm from "../Pages/MaintenanceForm";
import DailyIncome from "../Pages/DailyIncome";
import DailyExpense from "../Pages/DailyExpense";
import AllUsers from "../Pages/AllUsers";
import AddUserForm from "../Pages/AddUserForm";
import Login from "../components/Form/Login";
import ResetPass from "../components/Form/ResetPass";
import PrivateRoute from "./PrivateRoute";
import UpdateCarForm from "../Pages/updateForm/UpdateCarForm";
import UpdateTripForm from "../Pages/updateForm/UpdateTripForm";
import UpdateFuelForm from "../Pages/updateForm/UpdateFuelForm";
import UpdatePartsForm from "../Pages/updateForm/UpdatePartsForm";
import UpdateUsersForm from "../Pages/updateForm/UpdateUsersForm";
import UpdateMaintenanceForm from "../Pages/updateForm/UpdateMaintenanceForm";
import UpdateDriverForm from "../Pages/updateForm/UpdateDriverForm";
import UpdateDailyIncomeForm from "../Pages/updateForm/UpdateDailyIncomeForm";
import UpdateExpenseForm from "../Pages/updateForm/UpdateExpenseForm";
import AdminRoute from "./AdminRoute";
import MonthlyStatement from "../Pages/MonthlyStatement";
import Booking from "../Pages/Booking";
import AddBooking from "../Pages/AddBooking";
import UpdateBooking from "../Pages/UpdateBooking";
import OfficialExpense from "../Pages/OfficialExpense";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: "/",
        element: (
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        ),
      },
      {
        path: "/CarList",
        element: (
          <AdminRoute>
            <CarList />
          </AdminRoute>
        ),
      },
      {
        path: "/AddCarForm",
        element: (
          <AdminRoute>
            <AddCarForm />
          </AdminRoute>
        ),
      },
      {
        path: "/UpdateCarForm/:id",
        element: (
          <AdminRoute>
            <UpdateCarForm />
          </AdminRoute>
        ),
        loader: ({ params }) =>
          fetch(
            `https://pochao.tramessy.com/backend/api/vehicle/${params.id}`
          ),
      },
      {
        path: "/DriverList",
        element: (
          <AdminRoute>
            <DriverList />
          </AdminRoute>
        ),
      },
      {
        path: "/AddDriverForm",
        element: (
          <AdminRoute>
            <AddDriverForm />
          </AdminRoute>
        ),
      },
      {
        path: "/UpdateDriverForm/:id",
        element: (
          <AdminRoute>
            <UpdateDriverForm />
          </AdminRoute>
        ),
        loader: ({ params }) =>
          fetch(
            `https://pochao.tramessy.com/backend/api/driver/${params.id}`
          ),
      },
      {
        path: "/TripList",
        element: (
          <PrivateRoute>
            <TripList />
          </PrivateRoute>
        ),
      },
      {
        path: "/AddTripForm",
        element: (
          <PrivateRoute>
            <AddTripForm />
          </PrivateRoute>
        ),
      },
      {
        path: "/UpdateTripForm/:id",
        element: (
          <AdminRoute>
            <UpdateTripForm />
          </AdminRoute>
        ),
        loader: ({ params }) =>
          fetch(`https://pochao.tramessy.com/backend/api/trip/${params.id}`),
      },
      {
        path: "/Fuel",
        element: (
          <AdminRoute>
            <Fuel />
          </AdminRoute>
        ),
      },
      {
        path: "/FuelForm",
        element: (
          <AdminRoute>
            <FuelForm />
          </AdminRoute>
        ),
      },
      {
        path: "/UpdateFuelForm/:id",
        element: (
          <AdminRoute>
            <UpdateFuelForm />
          </AdminRoute>
        ),
        loader: ({ params }) =>
          fetch(`https://pochao.tramessy.com/backend/api/fuel/${params.id}`),
      },
      {
        path: "/Parts",
        element: (
          <AdminRoute>
            <Parts />
          </AdminRoute>
        ),
      },
      {
        path: "/UpdatePartsForm/:id",
        element: (
          <AdminRoute>
            <UpdatePartsForm />
          </AdminRoute>
        ),
        loader: ({ params }) =>
          fetch(
            `https://pochao.tramessy.com/backend/api/parts/${params.id}`
          ),
      },
      {
        path: "/Maintenance",
        element: (
          <AdminRoute>
            <Maintenance />
          </AdminRoute>
        ),
      },
      {
        path: "/MaintenanceForm",
        element: (
          <AdminRoute>
            <MaintenanceForm />
          </AdminRoute>
        ),
      },
      {
        path: "/UpdateMaintenanceForm/:id",
        element: (
          <AdminRoute>
            <UpdateMaintenanceForm />
          </AdminRoute>
        ),
        loader: ({ params }) =>
          fetch(
            `https://pochao.tramessy.com/backend/api/maintenance/${params.id}`
          ),
      },
      {
        path: "/Booking",
        element: (
          <AdminRoute>
            <Booking />
          </AdminRoute>
        ),
      },
      {
        path: "/AddBooking",
        element: (
          <AdminRoute>
            <AddBooking />
          </AdminRoute>
        ),
      },
      {
        path: "/UpdateBooking/:id",
        element: (
          <AdminRoute>
            <UpdateBooking />
          </AdminRoute>
        ),
        loader: ({ params }) =>
          fetch(
            `https://pochao.tramessy.com/backend/api/booking/${params.id}`
          ),
      },
      {
        path: "/OfficialExpense",
        element: (
          <AdminRoute>
            <OfficialExpense />
          </AdminRoute>
        ),
      },
      {
        path: "/DailyIncome",
        element: (
          <AdminRoute>
            <DailyIncome />
          </AdminRoute>
        ),
      },
      {
        path: "/DailyExpense",
        element: (
          <AdminRoute>
            <DailyExpense />
          </AdminRoute>
        ),
      },
      {
        path: "/MonthlyStatement",
        element: (
          <AdminRoute>
            <MonthlyStatement />
          </AdminRoute>
        ),
      },
      {
        path: "/AllUsers",
        element: (
          <AdminRoute>
            <AllUsers />
          </AdminRoute>
        ),
      },
      {
        path: "/AddUserForm",
        element: (
          <AdminRoute>
            <AddUserForm />
          </AdminRoute>
        ),
      },
      {
        path: "/UpdateUsersForm/:id",
        element: (
          <AdminRoute>
            <UpdateUsersForm />
          </AdminRoute>
        ),
        loader: ({ params }) =>
          fetch(
            `https://pochao.tramessy.com/backend/api/users/${params.id}`
          ),
      },
      {
        path: "/Login",
        element: <Login />,
      },
      {
        path: "/ResetPass",
        element: <ResetPass />,
      },
      {
        path: "/UpdateDailyIncomeForm/:id",
        element: (
          <AdminRoute>
            <UpdateDailyIncomeForm />
          </AdminRoute>
        ),
        loader: ({ params }) =>
          fetch(`https://pochao.tramessy.com/backend/api/trip/${params.id}`),
      },
      {
        path: "/UpdateExpenseForm/:id",
        element: (
          <AdminRoute>
            <UpdateExpenseForm />
          </AdminRoute>
        ),
        loader: ({ params }) =>
          fetch(`https://pochao.tramessy.com/backend/api/trip/${params.id}`),
      },
    ],
  },
]);
