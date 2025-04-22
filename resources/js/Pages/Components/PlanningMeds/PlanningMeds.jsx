import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsersByRole } from "../../../Redux/users/userSlice";
import { AiOutlineArrowRight } from "react-icons/ai"; // Import the desired icon

const PlanningMeds = () => {
  const dispatch = useDispatch();

  // Fetch users from the Redux store
  const { items: users, status } = useSelector((state) => state.users);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchUsersByRole("doctor")); // Fetch only users with the "doctor" role
    }
  }, [dispatch, status]);

  return (
    <div className="col-xxl-4">
      <div className="card">
        <div className="card-header border-bottom">
          <div className="d-flex align-items-center flex-wrap gap-2 justify-content-between">
            <h6 className="mb-2 fw-bold text-lg mb-0">Doctors List</h6>
            <a
              href="#"
              className="text-primary-600 hover-text-primary d-flex align-items-center gap-1"
            >
              View All
              <AiOutlineArrowRight className="icon" />
            </a>
          </div>
        </div>
        <div className="card-body">
          <div className="d-flex flex-column gap-24">
            {status === "loading" && <p>Loading...</p>}
            {status === "failed" && <p>Failed to load users.</p>}
            {users.map((user) => {
              // Determine availability based on the user's status
              const isAvailable = user.status === 1;

              return (
                <div
                  key={user.id}
                  className="d-flex align-items-center justify-content-between gap-3"
                >
                  <div className="d-flex align-items-center">
                    <img
                      src={user.img_path || "assets/images/default-avatar.png"}
                      alt={`${user.name} ${user.prenom}`}
                      className="w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden"
                    />
                    <div className="flex-grow-1">
                      <h6 className="text-md mb-0">{`${user.name} ${user.prenom}`}</h6>
                      <span className="text-sm text-secondary-light fw-medium">
                        {user.role || "Unknown Role"}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`${
                      isAvailable
                        ? "bg-success-focus text-success-main"
                        : "bg-danger-focus text-danger-main"
                    } radius-8 fw-medium text-sm`}
                    style={{ padding: "0.8rem 1rem" }} // Adjusted padding
                  >
                    {isAvailable ? "Available" : "Not Available"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanningMeds;