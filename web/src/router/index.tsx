import { createBrowserRouter } from "react-router"
import DashboardLayout from "@/layouts/dashboard-layout"
import DashboardIndex from "@/pages/dashboard/index"
import AccountSettings from "@/pages/dashboard/settings/account-settings"
import NotificationSettings from "@/pages/dashboard/settings/notification-settings"
import ClientsPage from "@/pages/dashboard/clients/index"
import ClientDetailPage from "@/pages/dashboard/clients/detail"
import ClientDietPlansPage from "@/pages/dashboard/clients/diet-plans"
import ClientNotesPage from "@/pages/dashboard/clients/notes"
import ClientFinancialPage from "@/pages/dashboard/clients/financial"
import ClientProgressPage from "@/pages/dashboard/clients/progress"
import ActivityLogsPage from "@/pages/dashboard/activity-logs"
import DietTemplatesPage from "@/pages/dashboard/diet-templates/index"
import DietTemplateDetailPage from "@/pages/dashboard/diet-templates/detail"
import FinancialRecordsPage from "@/pages/dashboard/financial/index"

import SignIn from "@/pages/auth/sign-in"
import SignUp from "@/pages/auth/sign-up"
import ForgotPassword from "@/pages/auth/forgot-password"
import SubscriptionPage from "@/pages/subscription/index"
import PaymentPage from "@/pages/subscription/payment"
import NotFound from "@/pages/not-found"

export const router = createBrowserRouter([
    {
        path: '/',
        element: <DashboardLayout />,
        children: [
            {
                index: true,
                element: <DashboardIndex />
            },
            {
                path: '/dashboard/settings/account',
                element: <AccountSettings />
            },
            {
                path: '/dashboard/settings/notifications',
                element: <NotificationSettings />
            },
            {
                path: '/clients',
                element: <ClientsPage />
            },
            {
                path: '/clients/:id',
                element: <ClientDetailPage />
            },
            {
                path: '/clients/:id/diet-plans',
                element: <ClientDietPlansPage />
            },
            {
                path: '/clients/:id/notes',
                element: <ClientNotesPage />
            },
            {
                path: '/clients/:id/financial',
                element: <ClientFinancialPage />
            },
            {
                path: '/clients/:id/progress',
                element: <ClientProgressPage />
            },
            {
                path: '/activity-logs',
                element: <ActivityLogsPage />
            },
            {
                path: '/diet-templates',
                element: <DietTemplatesPage />
            },
            {
                path: '/diet-templates/:id',
                element: <DietTemplateDetailPage />
            },
            {
                path: '/financial',
                element: <FinancialRecordsPage />
            }
        ]

    },
    {
        path: '/sign-in',
        element: <SignIn />
    },
    {
        path: '/sign-up',
        element: <SignUp />
    },
    {
        path: '/forgot-password',
        element: <ForgotPassword />
    },
    {
        path: '/subscription',
        element: <SubscriptionPage />
    },
    {
        path: '/subscription/payment',
        element: <PaymentPage />
    },
    {
        path: '*',
        element: <NotFound />
    }
])