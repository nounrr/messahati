import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { Link, usePage, router } from '@inertiajs/react';

const MasterLayout = ({ children }) => {
  const [sidebarActive, setSidebarActive] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const { auth } = usePage().props;

  const menuGroups = [
    {
      title: "Principal",
      items: [
        { title: "Dashboard", route: "dashboard", icon: "solar:home-smile-angle-outline", permission: null },
        { title: "Rendez-vous", route: "rdv.view", icon: "solar:calendar-dot-line-outline", permission: "view appointment" },
        { title: "Chat", route: "chat.view", icon: "solar:chat-round-dots-outline", permission: null }
      ]
    },
    {
      title: "Administration",
      items: [
        { title: "Utilisateurs", route: "users.view", icon: "solar:users-group-rounded-outline", permission: "create user" },
        { title: "Rôles & Permissions", route: "roles.view", icon: "solar:lock-keyhole-minimalistic-outline", permission: "assign roles" },
        { title: "Audit", route: "audit.view", icon: "solar:history-outline", permission: null }
      ]
    },
    {
      title: "Gestion",
      items: [
        { title: "Départements", route: "departement.view", icon: "solar:buildings-2-outline", permission: null },
        { title: "Partenaires", route: "partenaire.view", icon: "solar:handshake-outline", permission: null },
        { title: "Mutuels", route: "mutuels.view", icon: "solar:shield-user-outline", permission: null }
      ]
    },
    {
      title: "Médical",
      items: [
        { title: "Traitements", route: "traitements.view", icon: "solar:pills-outline", permission: null },
        { title: "Type Traitements", route: "type-traitements.view", icon: "solar:medicine-outline", permission: null },
        { title: "Ordonnances", route: "ordonnance.view", icon: "solar:file-text-outline", permission: "view prescription" },
        { title: "Certificats", route: "certificat.view", icon: "solar:diploma-verified-outline", permission: null }
      ]
    },
    {
      title: "Finance",
      items: [
        { title: "Paiements", route: "payment.view", icon: "solar:card-outline", permission: "view payments" },
        { title: "Charges", route: "charges.view", icon: "solar:bill-list-outline", permission: null },
        { title: "Salaires", route: "salaire.view", icon: "solar:wallet-money-outline", permission: null }
      ]
    },
    {
      title: "Retour",
      items: [
        { title: "Feedbacks", route: "feedback.view", icon: "solar:chat-square-like-outline", permission: null },
        { title: "Statistiques", route: "statistiques", icon: "solar:chart-outline", permission: "view statistics" }
      ]
    }
  ];

  const hasPermission = (permission) => {
    if (!permission) return true;
    if (!auth || !auth.user) return false;
    const userPermissions = auth.user.permissions || [];
    const userRoles = auth.user.roles || [];

    if (userPermissions.some(p => p.name === permission)) return true;

    return userRoles.some(role =>
      role.permissions && role.permissions.some(p => p.name === permission)
    );
  };

  const toggleSidebar = () => {
    setSidebarActive(!sidebarActive);
  };

  const toggleMobileMenu = () => {
    setMobileMenu(false);
  };

  const hasAccessibleItems = (group) => {
    return group.items.some(item => hasPermission(item.permission));
  };

  useEffect(() => {
    const handleDropdownClick = (event) => {
      if (!event.target.closest('a[href]')) {
        event.preventDefault();
      }

      const clickedDropdown = event.currentTarget.closest(".dropdown");
      if (!clickedDropdown) return;

      const isActive = clickedDropdown.classList.contains("open");

      document.querySelectorAll(".sidebar-menu .dropdown").forEach(dropdown => {
        dropdown.classList.remove("open");
        const submenu = dropdown.querySelector(".sidebar-submenu");
        if (submenu) submenu.style.maxHeight = "0px";
      });

      if (!isActive) {
        clickedDropdown.classList.add("open");
        const submenu = clickedDropdown.querySelector(".sidebar-submenu");
        if (submenu) submenu.style.maxHeight = `${submenu.scrollHeight}px`;
      }
    };

    const dropdownTriggers = document.querySelectorAll(".sidebar-menu .dropdown > a");
    dropdownTriggers.forEach(trigger => {
      trigger.addEventListener("click", handleDropdownClick);
    });

    return () => {
      dropdownTriggers.forEach(trigger => {
        trigger.removeEventListener("click", handleDropdownClick);
      });
    };
  }, []);

  useEffect(() => {
    const handleUrlChange = () => {
      if (mobileMenu) setMobileMenu(false);
    };

    router.on('navigate', handleUrlChange);
    return () => router.off('navigate', handleUrlChange);
  }, [mobileMenu]);

  return (
    <section className={mobileMenu ? "overlay active" : "overlay"}>
      <aside className={`sidebar ${sidebarActive ? 'active' : ''} ${mobileMenu ? 'sidebar-open' : ''}`}>
        <button onClick={toggleMobileMenu} className='sidebar-close-btn'>
          <Icon icon='radix-icons:cross-2' />
        </button>
        <div className='sidebar-logo'>
          <Link href={route('dashboard')}>
            <img src={sidebarActive ? '/assets/images/logo-mobile.png' : '/assets/images/logo.png'} alt='Logo' />
          </Link>
        </div>
        <div className='sidebar-menu-area'>
          <ul className='sidebar-menu'>
            <div className="profile flex">
              <div className='dropdown'>
                <button className='rounded-full'>
                  <img src='/assets/images/user.png' alt='user' className='w-10 h-10 rounded-full' />
                </button>
              </div>
              <div className="info">
                {/* <h2>{auth.user.name} {auth.user.prenom}</h2> */}
              </div>
            </div>
            {menuGroups.map((group, groupIndex) =>
              hasAccessibleItems(group) && (
                <li key={groupIndex} className='menu-group'>
                  {!sidebarActive && <div className='menu-group-title'>{group.title}</div>}
                  {group.items.map((item, itemIndex) =>
                    hasPermission(item.permission) && (
                      <Link key={itemIndex} href={route(item.route)} className='menu-item'>
                        <Icon icon={item.icon} className='menu-icon' />
                        <span className='menu-title'>{item.title}</span>
                      </Link>
                    )
                  )}
                </li>
              )
            )}
          </ul>
        </div>

        <style jsx>{`
          .menu-group { margin-bottom: 16px; }
          .menu-group-title {
            font-size: 12px;
            text-transform: uppercase;
            color: #6c757d;
            padding: 8px 16px;
            margin-top: 8px;
          }
          .menu-item {
            display: flex;
            align-items: center;
            padding: 10px 16px;
            color: #333;
            transition: all 0.3s;
            border-radius: 6px;
            margin: 4px 10px;
          }
          .menu-item:hover { background-color: rgba(0, 0, 0, 0.05); }
          .menu-icon { font-size: 20px; margin-right: 10px; }
          .menu-title { white-space: nowrap; }
        `}</style>
      </aside>

      <main className={`dashboard-main ${sidebarActive ? 'active' : ''}`}>
        <div className='navbar-header flex justify-between items-center p-4 bg-white shadow'>
          <div className='flex items-center gap-4'>
            <button onClick={toggleSidebar}>
              <Icon icon={sidebarActive ? 'iconoir:arrow-right' : 'heroicons:bars-3-solid'} className='text-2xl' />
            </button>
            <button onClick={() => setMobileMenu(!mobileMenu)} className='md:hidden'>
              <Icon icon='heroicons:bars-3-solid' />
            </button>
            <form className='navbar-search hidden md:block'>
              <input type='text' placeholder='Search' />
              <Icon icon='ion:search-outline' />
            </form>
          </div>
          <div className='flex items-center gap-3'>
            <div className='dropdown'>
              <button className='rounded-full bg-gray-200 w-10 h-10 flex items-center justify-center'>
                <Icon icon='iconoir:bell' />
              </button>
            </div>
          </div>
        </div>

        <div className='dashboard-main-body p-6'>
          {children}
        </div>

        <footer className='p-4 text-center text-gray-500'>
          © 2024 Messhati. All Rights Reserved.
        </footer>
      </main>
    </section>
  );
};

export default MasterLayout;
