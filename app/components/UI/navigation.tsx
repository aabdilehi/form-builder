import { Link, useLoaderData } from "@remix-run/react";
import { useClickAway } from "@uidotdev/usehooks";
import { forwardRef, useRef, useState } from "react";
import placeholderAvatar from "~/placeholder-avatar.png";
import { loader } from "~/root";

const ProfileIcon = ({ image }: { image?: string }) => {
  return (
    <img className="w-10 h-10 rounded-full" src={image ?? placeholderAvatar} />
  );
};

type MenuItemOptions = {
  icon?: string;
  label: string;
  redirect?: string;
};

const loggedInMenuOptions: MenuItemOptions[] = [
  { label: "Dashboard", redirect: "/dashboard" },
  { label: "Account Settings", redirect: "/account" },
  { label: "Sign out", redirect: "/logout" },
];

const MenuItem = ({ option }: { option: MenuItemOptions }) => {
  return (
    <div className="p-2 text-gray-800 hover:bg-indigo-50 hover:text-indigo-700 rounded-md active:bg-white">
      {option.redirect ? (
        <Link
          to={option.redirect}
          reloadDocument
          className="flex items-center space-x-2"
        >
          {!!option.icon ? <img src={option.icon} alt={option.label} /> : null}
          <span>{option.label}</span>
        </Link>
      ) : (
        <div className="flex items-center space-x-2">
          {!!option.icon ? <img src={option.icon} alt={option.label} /> : null}
          <span>{option.label}</span>
        </div>
      )}
    </div>
  );
};

const Menu = forwardRef(
  (
    {
      header,
      options,
    }: {
      header?: React.JSX.Element;
      options: MenuItemOptions[];
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className="bg-white p-2 drop-shadow-lg ring-1 rounded-md ring-gray-300 origin-top-right z-10 mt-4 absolute right-0 w-[16rem]"
        role="menu"
      >
        {!header ? null : header}
        <div>
          {options.map((option) => (
            <MenuItem option={option} />
          ))}
        </div>
      </div>
    );
  }
);

const Profile = ({ image }: { image?: string }) => {
  const { user } = useLoaderData<typeof loader>();
  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useRef(null);
  const menuRef = useClickAway(() => setMenuOpen(false));

  return (
    <div className="text-right relative w-fit" ref={ref}>
      <div className="w-full flex justify-end">
        <button
          className="flex flex-row items-center hover:bg-indigo-50 rounded-md px-2 py-1 focus:ring-1 focus:shadow-inner focus:shadow-sm focus:ring-indigo-200/50 active:bg-gray-200/50"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-haspopup="true"
          aria-expanded={menuOpen}
        >
          <ProfileIcon image={image} />
          <p className="ml-2">{user.username}</p>
        </button>
      </div>
      {menuOpen && <Menu ref={menuRef} options={loggedInMenuOptions} />}
    </div>
  );
};

export default () => {
  const { user } = useLoaderData<typeof loader>();

  return (
    <div
      className="bg-white w-full h-fit p-2 ring-1 mb-2 ring-gray-300/50 flex flex-row items-center justify-between"
      role="navigation"
    >
      {/* Left side of nav*/}
      <nav className="ml-2 flex flex-row items-center space-x-4">
        <Link
          to={"/"}
          reloadDocument
          className="text-lg font-semibold text-gray-800 hover:text-indigo-500 transition"
          aria-label="Home"
        >
          Home
        </Link>
        {/* More links can be added here */}
      </nav>

      {/* Right side of nav */}
      <nav className="flex flex-row items-center space-x-4">
        {/* Logged in options only */}
        {user && (
          <>
            <Link
              to={"/create"}
              reloadDocument
              className="text-lg font-semibold text-gray-800 hover:text-indigo-500 transition"
              aria-label="Create New Questionnaire"
            >
              Create
            </Link>
            <Link
              to={"/dashboard"}
              reloadDocument
              className="text-lg font-semibold text-gray-800 hover:text-indigo-500 transition"
              aria-label="Dashboard"
            >
              Dashboard
            </Link>
          </>
        )}
        {!!user ? (
          <Profile />
        ) : (
          <Link
            to={"/login"}
            reloadDocument
            className="text-lg mr-2 text-gray-800 hover:text-indigo-500 transition"
          >
            Login
          </Link>
        )}
      </nav>
    </div>
  );
};
