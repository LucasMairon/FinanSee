"use client";
import { createContext, useContext, useState, useCallback } from "react";

// API
import api from "@/api";

// Libs
import { toast } from "react-hot-toast";

// Components
import LoadingView from "@/components/loadingView";

// Validators
import { formatDate3, openPdfBlob } from "@/validators";
import { format } from "date-fns";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [loadingUser, setLoadingUser] = useState(false);
  const [loadingOutlays, setLoadingOutlays] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(false);

  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userCreate, setUserCreate] = useState(null);
  const [categories, setCategories] = useState([]);
  const [outlays, setOutlays] = useState([]);
  const [outlayForms, setOutlayForms] = useState(null);
  const [outlayFormsCurrent, setOutlayFormsCurrent] = useState(null);
  const [outlayEvolution, setOutlayEvolution] = useState(null);

  const logout = useCallback(() => {
    setUser(null);
    setUserData(null);
    setCategories([]);
    setOutlays([]);
    setOutlayForms(null);
    setOutlayFormsCurrent(null);
    setOutlayEvolution(null);
    localStorage.removeItem("token");
    localStorage.removeItem("tokenReflesh");
  }, []);

  const cleanState = useCallback(() => {
    setUserCreate(null);
  }, []);

  const handleApiError = (error, defaultMessage) => {
    if (error?.response?.data?.code === "token_not_valid") {
      toast.error("Sua sessão expirou. Logue novamente");
    } else {
      console.log("API Error:", error.response || error.message || error);
      const errorMessageApi = error?.response?.data?.detail;
      toast.error(errorMessageApi || defaultMessage);
    }
  };

  // -------- OUTLAYS --------
  const getOutlays = useCallback(() => {
    setLoadingOutlays(true);
    api
      .get("expenses/")
      .then((resp) => setOutlays(resp.data.results || []))
      .catch((error) => handleApiError(error, "Erro ao buscar despesas"))
      .finally(() => setLoadingOutlays(false));
  }, []);

  const createOutlay = useCallback(
    (...params) => {
      setLoadingOutlays(true);
      const [name, description, value, date, category, status] = params;
      const data = {
        name,
        description,
        value: value?.replace(/\./g, "").replace(",", "."),
        date: formatDate3(date),
        categories: [category],
        status,
      };
      api
        .post("expenses/", data)
        .then(() => {
          getOutlays();
          toast.success("Despesa criada com sucesso!");
        })
        .catch((error) =>
          handleApiError(error, "Erro ao criar despesa. Tente novamente.")
        )
        .finally(() => setLoadingOutlays(false));
    },
    [getOutlays]
  );

  const editOutlay = useCallback(
    (id, name, description, value, date, category, status) => {
      setLoadingOutlays(true);
      const data = {
        name,
        description,
        value: value?.replace(/\./g, "").replace(",", "."),
        date: formatDate3(date),
        categories: [category],
        status,
      };
      api
        .put(`expenses/${id}`, data)
        .then(() => {
          getOutlays();
          toast.success("Despesa editada com sucesso!");
        })
        .catch((error) =>
          handleApiError(error, "Erro ao editar despesa. Tente novamente.")
        )
        .finally(() => setLoadingOutlays(false));
    },
    [getOutlays]
  );

  const deleteOutlay = useCallback(
    (id) => {
      setLoadingOutlays(true);
      api
        .delete(`expenses/${id}`)
        .then(() => {
          getOutlays();
          toast.success("Despesa excluída com sucesso!");
        })
        .catch((error) =>
          handleApiError(error, "Erro ao excluir despesa. Tente novamente.")
        )
        .finally(() => setLoadingOutlays(false));
    },
    [getOutlays]
  );

  const getOutlayForms = useCallback(() => {
    setLoadingOutlays(true);
    api
      .get("periods/daily_evolution/")
      .then((resp) => setOutlayForms(resp.data))
      .catch((error) =>
        handleApiError(error, "Erro ao buscar dados de despesas.")
      )
      .finally(() => setLoadingOutlays(false));
  }, []);

  const getOutlayFormsCurrent = useCallback(() => {
    setLoadingOutlays(true);
    api
      .get("periods/current_period")
      .then((resp) => setOutlayFormsCurrent(resp.data))
      .catch((error) =>
        handleApiError(error, "Erro ao buscar dados de despesas.")
      )
      .finally(() => setLoadingOutlays(false));
  }, []);

  const getOutlayEvolution = useCallback(() => {
    setLoadingOutlays(true);
    api
      .get("periods/financial_evolution/")
      .then((resp) => setOutlayEvolution(resp.data))
      .catch((error) =>
        handleApiError(error, "Erro ao buscar evolução financeira.")
      )
      .finally(() => setLoadingOutlays(false));
  }, []);

  const exportPdfOutlay = useCallback(() => {
    setLoadingOutlays(true);
    const data = {
      period_date: format(new Date(), "yyyy-MM-dd"),
    };
    api
      .post("periods/export/", data, {
        responseType: "blob",
      })
      .then((resp) => {
        toast.success("Relatório exportado com sucesso!");
        openPdfBlob(resp?.data);
      })
      .catch((error) =>
        handleApiError(error, "Erro ao exportar o relatório. Tente novamente.")
      )
      .finally(() => setLoadingOutlays(false));
  }, []);

  // -------- CATEGORIES --------
  const getCategories = useCallback(() => {
    setLoadingCategories(true);
    api
      .get("categories/")
      .then((resp) => setCategories(resp.data.results || []))
      .catch((error) => handleApiError(error, "Erro ao buscar categorias."))
      .finally(() => setLoadingCategories(false));
  }, []);

  const createCategory = useCallback(
    (name, description) => {
      setLoadingCategories(true);
      const data = { name, description };
      api
        .post("categories/", data)
        .then(() => {
          getCategories();
          toast.success("Categoria criada com sucesso!");
        })
        .catch((error) => handleApiError(error, "Erro ao criar categoria."))
        .finally(() => setLoadingCategories(false));
    },
    [getCategories]
  );

  const editCategory = useCallback(
    (id, name, description) => {
      setLoadingCategories(true);
      api
        .patch(`categories/${id}/`, { name, description })
        .then(() => {
          getCategories();
          toast.success("Categoria editada com sucesso!");
        })
        .catch((error) => handleApiError(error, "Erro ao editar categoria."))
        .finally(() => setLoadingCategories(false));
    },
    [getCategories]
  );

  const deleteCategory = useCallback(
    (id) => {
      setLoadingCategories(true);
      api
        .delete(`categories/${id}/`)
        .then(() => {
          getCategories();
          toast.success("Categoria deletada com sucesso!");
        })
        .catch((error) => handleApiError(error, "Erro ao deletar categoria."))
        .finally(() => setLoadingCategories(false));
    },
    [getCategories]
  );

  // -------- USER --------
  const getUser = useCallback(() => {
    setLoadingUser(true);
    api
      .get("auth/users/me/")
      .then((resp) => setUserData(resp.data))
      .catch((error) => handleApiError(error, "Erro ao buscar usuário."))
      .finally(() => setLoadingUser(false));
  }, []);

  const updateUser = useCallback(
    (name, cpf, email, date_of_birth, phone_number, income) => {
      setLoadingUser(true);
      const data = {
        name,
        cpf: cpf?.replace(/\.|-/g, ""),
        email,
        date_of_birth,
        phone_number: phone_number?.replace(/\D/g, ""),
        income,
      };
      api
        .put("auth/users/me/", data)
        .then(() => {
          getUser();
          toast.success("Perfil atualizado com sucesso!");
        })
        .catch((error) =>
          handleApiError(error, "Não foi possível atualizar o perfil.")
        )
        .finally(() => setLoadingUser(false));
    },
    [getUser]
  );

  const deleteAccount = useCallback(
    (currentPassword) => {
      console.log(currentPassword, "AQUI");
      setLoadingUser(true);
      api
        .delete("auth/users/me/", {
          data: { current_password: currentPassword },
        })
        .then(logout)
        .catch((error) =>
          handleApiError(error, "Não foi possível deletar a conta.")
        )
        .finally(() => setLoadingUser(false));
    },
    [logout]
  );

  const updatePassword = useCallback((oldPassword, newPassword) => {
    setLoadingUser(true);
    api
      .post("auth/users/set_password/", {
        current_password: oldPassword,
        new_password: newPassword,
      })
      .then(() => toast.success("Senha alterada com sucesso!"))
      .catch((error) =>
        handleApiError(error, "Não foi possível alterar a senha.")
      )
      .finally(() => setLoadingUser(false));
  }, []);

  // -------- AUTH --------
  const fetchLogin = useCallback(
    (email, password) => {
      setLoadingAuth(true);
      localStorage.setItem("token", null);
      localStorage.setItem("tokenReflesh", null);

      api
        .post("auth/jwt/create/", { email, password })
        .then((resp) => {
          setUser(resp.data);
          localStorage.setItem("token", resp.data.access);
          localStorage.setItem("tokenReflesh", resp.data.refresh);
          getUser();
        })
        .catch((error) =>
          handleApiError(error, "Erro ao fazer login. Tente novamente!")
        )
        .finally(() => setLoadingAuth(false));
    },
    [getUser]
  );

  const fetchUserCreate = useCallback(
    (name, document, email, birthDate, phone, income, password) => {
      setLoadingAuth(true);
      api
        .post("auth/users/", {
          name,
          email,
          cpf: document?.replace(/\.|-/g, ""),
          date_of_birth: formatDate3(birthDate),
          phone_number: phone?.replace(/\D/g, ""),
          income: income?.replace(/\./g, "").replace(",", "."),
          password,
          re_password: password,
        })
        .then((resp) => {
          setUserCreate(resp.data);
          toast.success("Conta criada com sucesso!");
        })
        .catch((error) =>
          handleApiError(error, "Erro ao criar conta. Tente novamente!")
        )
        .finally(() => setLoadingAuth(false));
    },
    []
  );

  const forgotPassword = useCallback((email) => {
    setLoadingAuth(true);
    api
      .post("auth/users/reset_password/", { email })
      .then(() =>
        toast.success("Código enviado com sucesso. Verifique seu e-mail")
      )
      .catch((error) => handleApiError(error, "Erro ao enviar o código."))
      .finally(() => setLoadingAuth(false));
  }, []);

  const isAnyLoading =
    loadingUser || loadingOutlays || loadingCategories || loadingAuth;

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        userCreate,
        categories,
        outlays,
        outlayForms,
        outlayFormsCurrent,
        outlayEvolution,
        fetchLogin,
        logout,
        fetchUserCreate,
        cleanState,
        getUser,
        updateUser,
        updatePassword,
        deleteAccount,
        getCategories,
        createCategory,
        editCategory,
        deleteCategory,
        getOutlays,
        createOutlay,
        editOutlay,
        deleteOutlay,
        getOutlayForms,
        getOutlayFormsCurrent,
        getOutlayEvolution,
        forgotPassword,
        loadingUser,
        loadingOutlays,
        loadingCategories,
        loadingAuth,
        exportPdfOutlay,
      }}
    >
      {isAnyLoading && <LoadingView />}
      {children}
    </AuthContext.Provider>
  );
};
