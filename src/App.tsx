import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import NewRecord from "@/pages/NewRecord";
import Timeline from "@/pages/Timeline";
import Members from "@/pages/Members";
import Reminders from "@/pages/Reminders";
import Statistics from "@/pages/Statistics";
import Handover from "@/pages/Handover";
import PetProfile from "@/pages/PetProfile";
import Calendar from "@/pages/Calendar";

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/record/new" element={<NewRecord />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/members" element={<Members />} />
          <Route path="/reminders" element={<Reminders />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/handover" element={<Handover />} />
          <Route path="/pet/new" element={<PetProfile />} />
          <Route path="/pet/:petId" element={<PetProfile />} />
          <Route path="/calendar" element={<Calendar />} />
        </Routes>
      </Layout>
    </Router>
  );
}
