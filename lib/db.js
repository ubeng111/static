import { Client } from 'pg';  // Import PostgreSQL client

// Buat konfigurasi koneksi ke CockroachDB
const client = new Client({
  connectionString: 'postgresql://iwan:7a6JSSngSPQq2O7MrPtTIA@round-faun-4107.jxf.gcp-asia-southeast1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full',
  ssl: {
    ca: `${process.cwd()}/public/root.crt`,  // Lokasi sertifikat SSL
  },
});

client.connect();  // Connect ke database

export default client;
