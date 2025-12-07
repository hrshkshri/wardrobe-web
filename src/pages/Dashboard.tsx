const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Welcome back, User!</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Users', value: '2,543' },
          { label: 'Revenue', value: '$12,453' },
          { label: 'Active Sessions', value: '573' },
          { label: 'Conversion', value: '8.2%' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="p-6 bg-white rounded-lg border shadow-sm"
          >
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-bold mt-2">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
