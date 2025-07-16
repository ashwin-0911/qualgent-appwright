import React, { useEffect, useState } from 'react';

interface Job {
  id: string;
  status: string;
  os: string;
  priority: number;
  group_id: string;
  created_at: string;
}

const App = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [platformFilter, setPlatformFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [groupFilter, setGroupFilter] = useState('');

  useEffect(() => {
    fetch('http://localhost:8080/jobs')
      .then(res => res.json())
      .then(data => setJobs(data));
  }, []);

  const filteredJobs = jobs.filter(job => {
    return (
      (platformFilter === '' || job.os === platformFilter) &&
      (statusFilter === '' || job.status === statusFilter) &&
      (groupFilter === '' || job.group_id === groupFilter)
    );
  });

  const uniqueGroups = [...new Set(jobs.map(job => job.group_id))];

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Qualgent Job Monitor</h1>

      <div style={{ marginBottom: '1rem' }}>
        <select value={platformFilter} onChange={e => setPlatformFilter(e.target.value)}>
          <option value="">All Platforms</option>
          <option value="ios">iOS</option>
          <option value="android">Android</option>
        </select>

        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ marginLeft: '1rem' }}>
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="running">Running</option>
          <option value="passed">Passed</option>
          <option value="failed">Failed</option>
        </select>

        <select value={groupFilter} onChange={e => setGroupFilter(e.target.value)} style={{ marginLeft: '1rem' }}>
          <option value="">All Groups</option>
          {uniqueGroups.map(group => (
            <option key={group} value={group}>
              {group}
            </option>
          ))}
        </select>
      </div>

      <table border={1} cellPadding={6}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Status</th>
            <th>OS</th>
            <th>Priority</th>
            <th>Group</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {filteredJobs.map(job => (
            <tr key={job.id}>
              <td>{job.id}</td>
              <td>{job.status}</td>
              <td>{job.os}</td>
              <td>{job.priority}</td>
              <td>{job.group_id}</td>
              <td>{new Date(job.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
