
import axios from "axios";
import { useEffect, useState } from "react";
import DashboardLayout from "./DashboardLayout";
import OverviewCard from "./OverviewCard";
import StatusBadge from "./StatusBadge";
import CreateClaimModal from "./CreateClaimModal";

const mockPolicies = [
  { id: "POL-10231", type: "Health Insurance", validTill: "31 Dec 2026" },
  { id: "POL-20411", type: "Vehicle Insurance", validTill: "12 Aug 2025" },
];

type Claim = {
  id: string;
  policyId: string;
  type: string;
  date: string;
  status: string;
};

const CustomerPage = () => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [name, setName] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState("");
  const [claimType, setClaimType] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user-info") || "{}");
    setName(user?.name || "User");
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    const res = await axios.get("https://jsonplaceholder.typicode.com/posts?_limit=2");
    setClaims(
      res.data.map((_: any, i: number) => ({
        id: `CLM-${90000 + i}`,
        policyId: mockPolicies[i % 2].id,
        type: i % 2 ? "Accident Damage" : "Medical Reimbursement",
        date: new Date().toLocaleDateString(),
        status: i % 2 ? "Approved" : "Under Review",
      }))
    );
  };

  const submitClaim = async () => {
    setLoading(true);
    await axios.post("https://jsonplaceholder.typicode.com/posts", {
      policyId: selectedPolicy,
      claimType,
      description,
    });

    setClaims((prev) => [
      {
        id: `CLM-${Math.random() * 100000}`,
        policyId: selectedPolicy,
        type: claimType,
        date: new Date().toLocaleDateString(),
        status: "Under Review",
      },
      ...prev,
    ]);

    setLoading(false);
    setShowModal(false);
    setClaimType("");
    setDescription("");
  };

  return (
    <DashboardLayout userName={name}>
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <OverviewCard title="Active Policies" value={`${mockPolicies.length}`} />
        <OverviewCard title="Total Claims" value={`${claims.length}`} />
        <OverviewCard title="Pending Claims" value={`${claims.filter(c => c.status === "Under Review").length}`} />
        <OverviewCard title="Approved Claims" value={`${claims.filter(c => c.status === "Approved").length}`} />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-medium">My Claims</h2>
        <table className="w-full text-sm">
          <thead className="text-neutral-500">
            <tr>
              <th>Claim ID</th><th>Policy</th><th>Type</th><th>Date</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {claims.map((c) => (
              <tr key={c.id} className="border-t">
                <td>{c.id}</td>
                <td>{c.policyId}</td>
                <td>{c.type}</td>
                <td>{c.date}</td>
                <td><StatusBadge status={c.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <CreateClaimModal
        open={showModal}
        loading={loading}
        onClose={() => setShowModal(false)}
        onSubmit={submitClaim}
        claimType={claimType}
        setClaimType={setClaimType}
        description={description}
        setDescription={setDescription}
      />
    </DashboardLayout>
  );
};

export default CustomerPage;
