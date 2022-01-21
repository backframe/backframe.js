// https://github.com/oracle/node-oracledb#-installation

const oracledb = require(`${process.cwd()}/node_modules/oracledb`);
const config = {
  user: "<your db user>",
  password: "<your db password>",
  connectString: "localhost:1521/orcl",
};

async function getEmployee(empId) {
  let conn;

  try {
    conn = await oracledb.getConnection(config);

    const result = await conn.execute(
      "select * from employees where employee_id = :id",
      [empId]
    );

    console.log(result.rows[0]);
  } catch (err) {
    console.log("Ouch!", err);
  } finally {
    if (conn) {
      // conn assignment worked, need to close
      await conn.close();
    }
  }
}

getEmployee(101);
