import { CompactNavigation } from "@/components/compact-navigation";
import AuthProvider from "@/providers/auth-provider";
import { OnboardingTour } from "@/components/onboarding-tour";
import { Outlet } from "react-router";

export default function DashboardLayout() {
    return (
        <AuthProvider>
            <div className="flex min-h-screen bg-background">
                <CompactNavigation />
                <main className="flex-1 overflow-y-auto">
                    <div className="p-4 pt-16 md:pt-6 md:p-6 lg:p-8">
                        <div className="max-w-5xl mx-auto">
                            <Outlet />
                        </div>
                    </div>
                </main>
            </div>
            <OnboardingTour />
        </AuthProvider>
    )
}
