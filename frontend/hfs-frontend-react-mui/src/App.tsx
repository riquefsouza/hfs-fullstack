import { Route, Routes } from "react-router-dom";
import ConfigPage from "./system/config/ConfigPage";
import Dashboard from "./Dashboard";
import NotFoundPage from "./system/notfound/NotFoundPage";
import UsuarioPage from "./system/usuario/UsuarioPage";
import AdmParameterCategoryPage from "./admin/pages/AdmParameterCategoryPage";

function App() {

  return (
    <main>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/hfs/funcionario" />
        <Route path="/admin/admParameterCategory" element={<AdmParameterCategoryPage />} />
        <Route path="/admin/admParameter" />
        <Route path="/admin/admProfile" />
        <Route path="/admin/admPage" />
        <Route path="/admin/admMenu" />
        <Route path="/system/usuario" element={<UsuarioPage />} />
        <Route path="/system/config" element={<ConfigPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </main>
  )

}

export default App
