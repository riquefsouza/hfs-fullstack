package br.com.hfs;

import org.junit.platform.suite.api.SelectClasses;
import org.junit.platform.suite.api.Suite;
import org.junit.platform.suite.api.SuiteDisplayName;

import br.com.hfs.admin.Adm11LimpezaTests;
import br.com.hfs.admin.Adm12ParameterCategoryServiceTests;
import br.com.hfs.admin.Adm13ParameterServiceTests;
import br.com.hfs.admin.Adm14PageServiceTests;
import br.com.hfs.admin.Adm15ProfileServiceTests;
import br.com.hfs.admin.Adm16MenuServiceTests;
import br.com.hfs.hfsfullstack.Adm21LimpezaTests;
import br.com.hfs.hfsfullstack.Adm22ParameterCategoryTests;
import br.com.hfs.hfsfullstack.Adm23ParameterTests;
import br.com.hfs.hfsfullstack.Adm24PageTests;
import br.com.hfs.hfsfullstack.Adm25ProfileTests;
import br.com.hfs.hfsfullstack.Adm26MenuTests;
import br.com.hfs.hfsfullstack.FuncionarioTests;

@Suite
@SuiteDisplayName("Application Suite Test")
//@SelectPackages({"br.com.hfs.admin", "br.com.hfs.hfsfullstack"})
@SelectClasses({
   Adm11LimpezaTests.class,
   Adm12ParameterCategoryServiceTests.class,
   Adm13ParameterServiceTests.class,
   Adm14PageServiceTests.class,
   Adm15ProfileServiceTests.class,
   Adm16MenuServiceTests.class,

   Adm21LimpezaTests.class,
   Adm22ParameterCategoryTests.class,
   Adm23ParameterTests.class,
   Adm24PageTests.class,
   Adm25ProfileTests.class,
   Adm26MenuTests.class,
   FuncionarioTests.class
})
public class ApplicationSuiteTest {
}
