import { Route, Routes } from "react-router-dom";
import ConfigPage from "./system/config/ConfigPage";
import Dashboard from "./Dashboard";
import NotFoundPage from "./system/notfound/NotFoundPage";
import UsuarioPage from "./system/usuario/UsuarioPage";
import AdmParameterCategoryPage from "./admin/pages/AdmParameterCategoryPage";
import AdmParameterPage from "./admin/pages/AdmParameterPage";
import AdmMenuPage from "./admin/pages/AdmMenuPage";
import AdmPagePage from "./admin/pages/AdmPagePage";
import AdmProfilePage from "./admin/pages/AdmProfilePage";
import FuncionarioPage from "./hfsfullstack/pages/FuncionarioPage";

function App() {

  return (
    <main>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/hfs/funcionario" element={<FuncionarioPage />} />
        <Route path="/admin/admParameterCategory" element={<AdmParameterCategoryPage />} />
        <Route path="/admin/admParameter" element={<AdmParameterPage />} />
        <Route path="/admin/admProfile" element={<AdmProfilePage />} />
        <Route path="/admin/admPage" element={<AdmPagePage />} />
        <Route path="/admin/admMenu" element={<AdmMenuPage />} />
        <Route path="/system/usuario" element={<UsuarioPage />} />
        <Route path="/system/config" element={<ConfigPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </main>
  )

}

export default App
