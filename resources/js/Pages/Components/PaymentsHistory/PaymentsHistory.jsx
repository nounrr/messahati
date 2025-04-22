import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchPayments } from "../../../Redux/payments/paymentSlice";
import { Link } from "react-router-dom";

const PaymentHistory = () => {
  const dispatch = useDispatch();
  const { items: payments, status } = useSelector((state) => state.payments);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchPayments());
    }
  }, [status, dispatch]);

  return (
    <div className="col-md-6">
      <div className="card radius-16">
        <div className="card-header">
          <div className="d-flex align-items-center flex-wrap gap-2 justify-content-between">
            <h6 className="mb-2 fw-bold text-lg mb-0">Payment History</h6>
            <Link
              to="#"
              className="text-primary-600 hover-text-primary d-flex align-items-center gap-1"
            >
              View All
              <iconify-icon
                icon="solar:alt-arrow-right-linear"
                className="icon"
              />
            </Link>
          </div>
        </div>
        <div className="card-body">
          {status === "loading" && <p>Loading...</p>}
          {status === "failed" && <p>Failed to load payments.</p>}
          {status === "succeeded" &&
            payments.map((payment, index) => (
              <div
                key={index}
                className="d-flex align-items-center justify-content-between pb-10 mb-10 border-bottom border-neutral-200"
              >
                <div>
                  <h6 className="text-md mb-0">{payment.patient_name}</h6> {/* Patient Name */}
                  <span className="text-sm text-secondary fw-medium">
                    {payment.typeTraitment}
                  </span>{" "}
                  {/* Type of Treatment */}
                  <span className="text-xs text-secondary-light fw-medium">
                    {payment.date}
                  </span>{" "}
                  {/* Date */}
                </div>
                <div>
                  <h6 className="text-sm mb-1">{payment.montant}</h6> {/* Amount */}
                  <span
                    className={`text-xs fw-medium rounded-pill px-3 ${
                      payment.status === "Paid"
                        ? "text-success-600 bg-success-100"
                        : payment.status === "Due"
                        ? "text-warning-600 bg-warning-100"
                        : "text-danger-600 bg-danger-100"
                    }`}
                  >
                    {payment.status}
                  </span>{" "}
                  {/* Status */}
                  <span className="text-xs text-secondary-light fw-medium">
                    {payment.paymentMethod}
                  </span>{" "}
                  {/* Payment Method */}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;
