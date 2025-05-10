import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation, Outlet } from "react-router-dom";
import ThemeToggleButton from "./ThemeToggleButton";
import { useSelector } from "react-redux";
import { 
  AiOutlineHome,
  AiOutlineUser,
  AiOutlineCalendar,
  AiOutlineFileText,
  AiOutlineMedicineBox,
  AiOutlineDollar,
  AiOutlineBarChart,
  AiOutlineSetting,
  AiOutlineMenu,
  AiOutlineClose,
  AiOutlineUserSwitch,
  AiOutlineLogout
} from 'react-icons/ai';
import 'bootstrap-icons/font/bootstrap-icons.css';

const MasterLayout = () => {
  let [sidebarActive, seSidebarActive] = useState(false);
  let [mobileMenu, setMobileMenu] = useState(false);
  const location = useLocation(); // Hook to get the current route
  const { user } = useSelector((state) => state.auth);

  // Fonction pour vérifier si l'utilisateur a un rôle spécifique
  const hasRole = (roleName) => {
    return user && user.roles && user.roles.some(role => role.name === roleName);
  };

  // Fonction pour vérifier si l'utilisateur a une permission spécifique
  const hasPermission = (permissionName) => {
    return user && user.permissions && user.permissions.includes(permissionName);
  };

  // Fonction pour vérifier si l'utilisateur a l'un des rôles spécifiés
  const hasAnyRole = (roleNames) => {
    return user && user.roles && user.roles.some(role => roleNames.includes(role.name));
  };

  // Fonction pour vérifier si l'utilisateur a l'une des permissions spécifiées
  const hasAnyPermission = (permissionNames) => {
    return user && user.permissions && user.permissions.some(permission => permissionNames.includes(permission));
  };

  useEffect(() => {
    const handleDropdownClick = (event) => {
      event.preventDefault();
      const clickedLink = event.currentTarget;
      const clickedDropdown = clickedLink.closest(".dropdown");

      if (!clickedDropdown) return;

      const isActive = clickedDropdown.classList.contains("open");

      // Close all dropdowns
      const allDropdowns = document.querySelectorAll(".sidebar-menu .dropdown");
      allDropdowns.forEach((dropdown) => {
        dropdown.classList.remove("open");
        const submenu = dropdown.querySelector(".sidebar-submenu");
        if (submenu) {
          submenu.style.maxHeight = "0px"; // Collapse submenu
        }
      });

      // Toggle the clicked dropdown
      if (!isActive) {
        clickedDropdown.classList.add("open");
        const submenu = clickedDropdown.querySelector(".sidebar-submenu");
        if (submenu) {
          submenu.style.maxHeight = `${submenu.scrollHeight}px`; // Expand submenu
        }
      }
    };

    // Attach click event listeners to all dropdown triggers
    const dropdownTriggers = document.querySelectorAll(
      ".sidebar-menu .dropdown > a, .sidebar-menu .dropdown > Link"
    );

    dropdownTriggers.forEach((trigger) => {
      trigger.addEventListener("click", handleDropdownClick);
    });

    const openActiveDropdown = () => {
      const allDropdowns = document.querySelectorAll(".sidebar-menu .dropdown");
      allDropdowns.forEach((dropdown) => {
        const submenuLinks = dropdown.querySelectorAll(".sidebar-submenu li a");
        submenuLinks.forEach((link) => {
          if (
            link.getAttribute("href") === location.pathname ||
            link.getAttribute("to") === location.pathname
          ) {
            dropdown.classList.add("open");
            const submenu = dropdown.querySelector(".sidebar-submenu");
            if (submenu) {
              submenu.style.maxHeight = `${submenu.scrollHeight}px`; // Expand submenu
            }
          }
        });
      });
    };

    // Open the submenu that contains the active route
    openActiveDropdown();

    // Cleanup event listeners on unmount
    return () => {
      dropdownTriggers.forEach((trigger) => {
        trigger.removeEventListener("click", handleDropdownClick);
      });
    };
  }, [location.pathname]);

  let sidebarControl = () => {
    seSidebarActive(!sidebarActive);
  };

  let mobileMenuControl = () => {
    setMobileMenu(!mobileMenu);
  };

  return (
    <section className={mobileMenu ? "overlay active" : "overlay "}>
      {/* sidebar */}
      <aside
        className={
          sidebarActive
            ? "sidebar active "
            : mobileMenu
            ? "sidebar sidebar-open"
            : "sidebar"
        }
      >
        <button
          onClick={mobileMenuControl}
          type='button'
          className='sidebar-close-btn'
        >
          <AiOutlineClose />
        </button>
        <div>
          <Link to='/' className='sidebar-logo'>
            <img
              src='assets/images/logo.png'
              alt='site logo'
              className='light-logo'
            />
            <img
              src='assets/images/logo-light.png'
              alt='site logo'
              className='dark-logo'
            />
            <img
              src='assets/images/logo-icon.png'
              alt='site logo'
              className='logo-icon'
            />
          </Link>
        </div>
        <div className='sidebar-menu-area'>
          <ul className='sidebar-menu' id='sidebar-menu'>
            {/* Dashboard - accessible à tous les utilisateurs connectés */}
            <li className='dropdown'>
              <Link to='#'>
                <Icon
                  icon={AiOutlineHome}
                  className='menu-icon'
                />
                <span>Dashboard</span>
              </Link>
              <ul className='sidebar-submenu'>
                <li>
                  <NavLink
                    to='/'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />
                    Tableau de bord
                  </NavLink>
                </li>
              </ul>
            </li>

            {/* Patients - accessible aux admins, doctors, secretaries, nurses et patients */}
            {(hasRole('admin') || hasRole('doctor') || hasRole('secretary') || hasRole('nurse') || hasRole('patient') || hasPermission('view patient')) && (
              <li className='dropdown'>
                <Link to='#'>
                <Icon
                    icon={AiOutlineUser}
                  className='menu-icon'
                />
                  <span>Patients</span>
              </Link>
              <ul className='sidebar-submenu'>
                  {(hasRole('admin') || hasRole('secretary') || hasPermission('create patient')) && (
                <li>
                  <NavLink
                        to='/patients/create'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                        <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />
                        Ajouter un patient
                  </NavLink>
                </li>
                  )}
                  {(hasRole('admin') || hasRole('doctor') || hasRole('secretary') || hasRole('nurse') || hasRole('patient') || hasPermission('view patient')) && (
                <li>
                  <NavLink
                        to='/patients'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-warning-main w-auto' />
                        Liste des patients
                  </NavLink>
                </li>
                  )}
              </ul>
            </li>
            )}

            {/* Rendez-vous - accessible aux admins, doctors, secretaries et patients */}
            {(hasRole('admin') || hasRole('doctor') || hasRole('secretary') || hasRole('patient') || hasPermission('view appointment')) && (
            <li className='dropdown'>
              <Link to='#'>
                  <Icon
                    icon={AiOutlineCalendar}
                    className='menu-icon'
                  />
                  <span>Rendez-vous</span>
              </Link>
              <ul className='sidebar-submenu'>
                  {(hasRole('admin') || hasRole('secretary') || hasPermission('create appointment')) && (
                <li>
                  <NavLink
                        to='/appointments/create'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                        <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />
                        Nouveau rendez-vous
                  </NavLink>
                </li>
                  )}
                  {(hasRole('admin') || hasRole('doctor') || hasRole('secretary') || hasRole('patient') || hasPermission('view appointment')) && (
                <li>
                  <NavLink
                        to='/appointments'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                        <i className='ri-circle-fill circle-icon text-warning-main w-auto' />
                        Liste des rendez-vous
                  </NavLink>
                </li>
                  )}
              </ul>
            </li>
            )}

            {/* Consultations - accessible aux admins et doctors */}
            {(hasRole('admin') || hasRole('doctor') || hasPermission('create consultation')) && (
            <li className='dropdown'>
              <Link to='#'>
                  <Icon
                    icon={AiOutlineFileText}
                    className='menu-icon'
                  />
                  <span>Consultations</span>
              </Link>
              <ul className='sidebar-submenu'>
                <li>
                  <NavLink
                      to='/consultations/create'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                      <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />
                      Nouvelle consultation
                  </NavLink>
                </li>
                <li>
                  <NavLink
                      to='/consultations'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-warning-main w-auto' />
                      Liste des consultations
                  </NavLink>
                </li>
              </ul>
            </li>
            )}

            {/* Dossiers médicaux - accessible aux admins, doctors et nurses */}
            {(hasRole('admin') || hasRole('doctor') || hasRole('nurse') || hasPermission('access medical record')) && (
            <li className='dropdown'>
              <Link to='#'>
                <Icon
                    icon={AiOutlineFileText}
                  className='menu-icon'
                />
                  <span>Dossiers médicaux</span>
              </Link>
              <ul className='sidebar-submenu'>
                <li>
                  <NavLink
                      to='/medical-records'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />
                      Liste des dossiers
                  </NavLink>
                </li>
              </ul>
            </li>
            )}

            {/* Prescriptions - accessible aux admins, doctors et patients */}
            {(hasRole('admin') || hasRole('doctor') || hasRole('patient') || hasPermission('view prescription')) && (
            <li className='dropdown'>
              <Link to='#'>
                <Icon
                    icon={AiOutlineMedicineBox}
                  className='menu-icon'
                />
                  <span>Prescriptions</span>
              </Link>
              <ul className='sidebar-submenu'>
                  {(hasRole('admin') || hasRole('doctor') || hasPermission('create prescription')) && (
                <li>
                  <NavLink
                        to='/prescriptions/create'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                        <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />
                        Nouvelle prescription
                  </NavLink>
                </li>
                  )}
                  {(hasRole('admin') || hasRole('doctor') || hasRole('patient') || hasPermission('view prescription')) && (
                <li>
                  <NavLink
                        to='/prescriptions'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                        <i className='ri-circle-fill circle-icon text-warning-main w-auto' />
                        Liste des prescriptions
                  </NavLink>
                </li>
                  )}
              </ul>
            </li>
            )}

            {/* Factures et paiements - accessible aux admins, accountants et patients */}
            {(hasRole('admin') || hasRole('accountant') || hasRole('patient') || hasPermission('view payments')) && (
            <li className='dropdown'>
              <Link to='#'>
                <Icon
                    icon={AiOutlineDollar}
                  className='menu-icon'
                />
                  <span>Factures & Paiements</span>
              </Link>
              <ul className='sidebar-submenu'>
                  {(hasRole('admin') || hasRole('accountant') || hasPermission('create invoice')) && (
                <li>
                  <NavLink
                        to='/invoices/create'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                        <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />
                        Nouvelle facture
                  </NavLink>
                </li>
                  )}
                  {(hasRole('admin') || hasRole('accountant') || hasPermission('view payments')) && (
                <li>
                  <NavLink
                        to='/invoices'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                        <i className='ri-circle-fill circle-icon text-warning-main w-auto' />
                        Liste des factures
                  </NavLink>
                </li>
                  )}
                  {(hasRole('admin') || hasRole('accountant') || hasPermission('view payments')) && (
                <li>
                  <NavLink
                        to='/payments'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                        <i className='ri-circle-fill circle-icon text-success-main w-auto' />
                        Paiements
                  </NavLink>
                </li>
                  )}
                  {(hasRole('admin') || hasRole('accountant') || hasPermission('manage refunds')) && (
                <li>
                  <NavLink
                        to='/refunds'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                        <i className='ri-circle-fill circle-icon text-danger-main w-auto' />
                        Remboursements
                  </NavLink>
                </li>
                  )}
              </ul>
            </li>
            )}

            {/* Rapports - accessible aux admins, doctors et accountants */}
            {(hasRole('admin') || hasRole('doctor') || hasRole('accountant') || hasPermission('generate medical reports') || hasPermission('generate financial reports')) && (
            <li className='dropdown'>
              <Link to='#'>
                <Icon
                    icon={AiOutlineBarChart}
                  className='menu-icon'
                />
                  <span>Rapports</span>
              </Link>
              <ul className='sidebar-submenu'>
                  {(hasRole('admin') || hasRole('doctor') || hasPermission('generate medical reports')) && (
                <li>
                  <NavLink
                        to='/reports/medical'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                        <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />
                        Rapports médicaux
                  </NavLink>
                </li>
                  )}
                  {(hasRole('admin') || hasRole('accountant') || hasPermission('generate financial reports')) && (
                <li>
                  <NavLink
                        to='/reports/financial'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                        <i className='ri-circle-fill circle-icon text-warning-main w-auto' />
                        Rapports financiers
                  </NavLink>
                </li>
                  )}
                  {(hasRole('admin') || hasPermission('view statistics')) && (
                <li>
                  <NavLink
                        to='/reports/statistics'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                        <i className='ri-circle-fill circle-icon text-info-main w-auto' />
                        Statistiques
                  </NavLink>
                </li>
                  )}
              </ul>
            </li>
            )}

            {/* Administration - accessible uniquement aux admins */}
            {hasRole('admin') && (
            <li className='dropdown'>
              <Link to='#'>
                <Icon
                    icon={AiOutlineSetting}
                  className='menu-icon'
                />
                  <span>Administration</span>
              </Link>
              <ul className='sidebar-submenu'>
                <li>
                  <NavLink
                      to='/admin/users'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                      <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />
                      Utilisateurs
                  </NavLink>
                </li>
                <li>
                  <NavLink
                      to='/admin/roles'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                      <i className='ri-circle-fill circle-icon text-warning-main w-auto' />
                      Rôles & Permissions
                  </NavLink>
                </li>
                <li>
                  <NavLink
                      to='/admin/settings'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                      <i className='ri-circle-fill circle-icon text-info-main w-auto' />
                      Paramètres
                  </NavLink>
                </li>
              </ul>
            </li>
            )}
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <main className='main-content'>
        {/* Header */}
        <header className='header'>
          <div className='header-left'>
                <button
                  onClick={sidebarControl}
                  type='button'
              className='sidebar-toggle-btn'
                >
              <AiOutlineMenu />
                </button>
              </div>
          <div className='header-right'>
            <div className='header-right-left'>
                <ThemeToggleButton />
                      </div>
            <div className='header-right-right'>
                <div className='dropdown'>
                  <button
                    type='button'
                  className='dropdown-toggle-btn'
                    data-bs-toggle='dropdown'
                  aria-expanded='false'
                >
                  <img
                    src='assets/images/avatar.png'
                    alt='avatar'
                    className='avatar-img'
                  />
                  <span className='user-name'>{user?.name || 'Utilisateur'}</span>
                  </button>
                <ul className='dropdown-menu'>
                  <li>
                    <Link to='/profile' className='dropdown-item'>
                      <AiOutlineUser className='dropdown-icon' />
                      Mon profil
                        </Link>
                      </li>
                      <li>
                    <Link to='/settings' className='dropdown-item'>
                      <AiOutlineSetting className='dropdown-icon' />
                      Paramètres
                        </Link>
                      </li>
                      <li>
                    <hr className='dropdown-divider' />
                      </li>
                      <li>
                    <Link to='/logout' className='dropdown-item'>
                      <AiOutlineLogout className='dropdown-icon' />
                      Déconnexion
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
        </header>

        {/* Page Content */}
        <div className='page-content'>
          <Outlet />
            </div>
      </main>
    </section>
  );
};

export default MasterLayout;
