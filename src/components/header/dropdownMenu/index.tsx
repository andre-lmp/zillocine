// Hooks
import { useContext } from "react";

// Icones do React-icons
import { FaUserLarge, FaPencil } from "react-icons/fa6";
import { AiFillDelete } from "react-icons/ai";
import { BsDoorOpenFill } from "react-icons/bs";
import { FaHeart } from "react-icons/fa";
import { MdAccountCircle } from "react-icons/md";
import { CgNotes } from "react-icons/cg";

// Componente para carregamento preguiçoso de imagens
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/opacity.css";

import { UserDataContext } from "@/components/contexts/authenticationContext";
import { GlobalEventsContext } from "@/components/contexts/globalEventsContext";
import useFirebase from "@/components/hooks/firebase";

export default function AccountDropdown() {
  const userData = useContext(UserDataContext);
  const globalEvents = useContext(GlobalEventsContext);
  const { deleteCurrentUser, signOutUser } = useFirebase();

  const ModalToggle = (modalType: string) => {
    globalEvents.setModalsController((prev) => ({
      ...prev,
      isLoginModalActive:
        modalType === "login"
          ? !prev.isLoginModalActive
          : prev.isLoginModalActive,
      isRegisterModalActive:
        modalType === "register"
          ? !prev.isRegisterModalActive
          : prev.isRegisterModalActive,
      loginErrorMessage: null,
      registerErrorMessage: null,
      googleAuthErrorMessage: null,
      githubAuthErrorMessage: null,
      formInstructionsMessage: null,
    }));
  };

  const openProfileModal = () => {
    globalEvents.setModalsController((prev) => ({
      ...prev,
      isProfileModalActive: !prev.isProfileModalActive,
    }));
  };

  return (
    /* Dropdown */
    <div className="hidden md:block dropdown dropdown-end dropdown-hover font-raleway">
      {/* Imagem do usuario caso ele tenha sido authenticado */}
      <div className="flex gap-x-5 items-center">
        <button
          id="account-button"
          tabIndex={0}
          role="button"
          className="w-[44px] h-[44px] rounded-full flex items-center justify-center outline-none border-none overflow-hidden bg-white/20"
        >
          {userData.photoUrl ? (
            <LazyLoadImage
              src={userData.photoUrl}
              height={44}
              width={44}
              effect="opacity"
              className="object-cover h-11 w-11 overflow-hidden"
            />
          ) : (
            <FaUserLarge />
          )}
        </button>
        {userData.isLoggedIn && userData.name ? (
          <div className="hidden xl:block">
            <p className="text-neutral-300 text-xl">
              Ola,{" "}
              <span className="font-semibold text-neutral-100">
                {userData.name}
              </span>
            </p>
          </div>
        ) : (
          <p className="text-xl font-semibold text-neutral-300">Conta</p>
        )}
      </div>

      {/* Container do conteudo do dropdown */}
      <div tabIndex={0} className="dropdown-content pt-2 font-noto_sans">
        {/* Menu com opções de login e registro caso o usuario nao esteja logado */}
        {!userData.isLoggedIn ? (
          <ul
            tabIndex={0}
            className="bg-darkpurple rounded-box z-[1] w-60 p-4 shadow"
          >
            <li
              key="li-element-6"
              onClick={() => {
                ModalToggle("register");
              }}
              className="px-4 h-7 rounded-3xl bg-orangered text-white text-base flex items-center justify-center font-medium cursor-pointer btn hover:bg-orangered border-0"
            >
              Registrar
            </li>

            <li
              key="li-element-7"
              onClick={() => {
                ModalToggle("login");
              }}
              className="px-4 h-7 rounded-3xl bg-white/10 text-white text-base flex items-center justify-center font-medium cursor-pointer mt-2 btn hover:bg-white/10 border-0"
            >
              Entrar
            </li>
          </ul>
        ) : (
          <div className="bg-darkpurple rounded-box overflow-hidden">
            {userData.name ? (
              <div className="xl:hidden p-4 hover:bg-white/10 cursor-pointer">
                <p className="font-semibold text-[19px]">{userData.name}</p>

                <div
                  onClick={openProfileModal}
                  className="flex flex-row items-center gap-x-2 text-neutral-500 text-[15px]"
                >
                  <FaPencil className="" />
                  <p>Editar perfil</p>
                </div>
              </div>
            ) : null}

            {/* Opções para usuarios logados */}
            <ul className="w-full flex flex-col items-start *:px-6 *:whitespace-nowrap *:gap-x-3 *:border-none *:outline-none font-medium text-base">
              <li
                onClick={openProfileModal}
                key="li-element-8"
                className="hidden text-neutral-300 hover:bg-white/10 cursor-pointer h-16 w-full xl:flex items-center"
              >
                Editar perfil
                <MdAccountCircle className="text-2xl" />
              </li>

              <li
                key="li-element-9"
                className="w-[calc(100%-32px)] hidden mx-auto h-px bg-white/5 my-4"
              ></li>

              <li
                key="li-element-10"
                className="text-neutral-300 hidden hover:bg-white/10 cursor-pointer h-12 w-full"
              >
                Favoritos
                <FaHeart className="text-lg" />
              </li>

              <li
                key="li-element-11"
                className="text-neutral-300 hidden hover:bg-white/10 cursor-pointer h-12 w-full"
              >
                Sobre o Zillocine
                <CgNotes className="text-lg" />
              </li>

              <li
                key="li-element-12"
                className="w-[calc(100%-32px)] mx-auto h-px bg-neutral-700 my-4 "
              ></li>

              <li
                onClick={signOutUser}
                key="li-element-13"
                className="text-error hover:bg-red-950 hover:text-white cursor-pointer h-12 w-full flex items-center flex-row-reverse xl:flex-row justify-end xl:justify-start"
              >
                Sair
                <BsDoorOpenFill className="text-lg" />
              </li>

              <li
                key="li-element-14"
                onClick={deleteCurrentUser}
                className="text-error hover:bg-red-950 hover:text-white cursor-pointer h-12 w-full flex items-center flex-row-reverse xl:flex-row justify-end xl:justify-start"
              >
                Excluir conta
                <AiFillDelete className="text-[19px]" />
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
