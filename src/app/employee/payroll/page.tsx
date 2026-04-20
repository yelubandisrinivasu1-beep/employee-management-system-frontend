"use client";

export default function EmployeePayrollPage() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 bg-white p-8 rounded-3xl shadow-sm border border-neutral-100 text-center">
      <h1 className="text-2xl font-bold text-neutral-800 mb-2">My Salary & Payroll</h1>
      <p className="text-neutral-500">View your monthly salary slips and deductions.</p>
      <div className="mt-8 p-12 border-2 border-dashed border-neutral-200 rounded-2xl">
        <p className="text-neutral-400">Payroll records will be displayed here.</p>
      </div>
    </div>
  );
}
