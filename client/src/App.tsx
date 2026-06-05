import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import MenHome from "./pages/MenHome";
import Privacy from "./pages/Privacy";
import Tokushoho from "./pages/Tokushoho";
import SalonPartner from "./pages/SalonPartner";
import PartnerDoc from "./pages/PartnerDoc";
import Booking from "./pages/Booking";
import Admin from "./pages/Admin";
import StaffLogin from "./pages/StaffLogin";
import AdminContent from "./pages/AdminContent";
import AdminBeforeAfter from "./pages/AdminBeforeAfter";
import AdminTestimonials from "./pages/AdminTestimonials";
import AdminBlog from "./pages/AdminBlog";
import AdminMenus from "./pages/AdminMenus";
import AdminSalons from "./pages/AdminSalons";
import AdminCalendar from "./pages/AdminCalendar";
import OwnerAdmin from "./pages/OwnerAdmin";
import Salons from "./pages/Salons";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/men"} component={MenHome} />
      <Route path={"/privacy"} component={Privacy} />
      <Route path={"/tokushoho"} component={Tokushoho} />
      <Route path={"/salon"} component={SalonPartner} />
      <Route path={"/partner-doc"} component={PartnerDoc} />
      <Route path={"/booking"} component={Booking} />
      <Route path={"/admin"} component={Admin} />
      <Route path={"/staff-login"} component={StaffLogin} />
      <Route path={"/admin/content"} component={AdminContent} />
      <Route path={"/admin/before-after"} component={AdminBeforeAfter} />
      <Route path={"/admin/testimonials"} component={AdminTestimonials} />
      <Route path={"/admin/blog"} component={AdminBlog} />
      <Route path={"/admin/menus"} component={AdminMenus} />
      <Route path={"/admin/salons"} component={AdminSalons} />
      <Route path={"/admin/calendar"} component={AdminCalendar} />
      <Route path={"/owner-admin"} component={OwnerAdmin} />
      <Route path={"/salons"} component={Salons} />
      <Route path={"/blog/:slug"} component={BlogPost} />
      <Route path={"/blog"} component={Blog} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
