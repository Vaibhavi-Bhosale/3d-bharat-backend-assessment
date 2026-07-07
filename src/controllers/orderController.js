const pool = require("../config/db");


// Create a new order
const createOrder = async (req, res) => {
    let connection;
  try {

      const { user, order } = req.body;

      connection = await pool.getConnection();
    await connection.beginTransaction();


    if (!user?.full_name || !user?.email || !user?.mobile) {
      return res.status(400).json({
        message: "User details are required",
      });
    }

    

    if (!order?.order_date || !order?.items || order.items.length === 0) {
      return res.status(400).json({
        message: "Order details are required",
      });
    }



    const [existingUsers] = await connection.query(
    `
    SELECT *
    FROM users
    WHERE email = ?
    OR mobile = ?
    `,
    [user.email, user.mobile]
);

let userId;

if (existingUsers.length > 0) {

    userId = existingUsers[0].user_id;

} else {

    const [newUser] = await connection.query(
        `
        INSERT INTO users
        (full_name, email, mobile)
        VALUES (?, ?, ?)
        `,
        [
            user.full_name,
            user.email,
            user.mobile
        ]
    );

    userId = newUser.insertId;
}

  console.log(existingUsers);

    const productNames =
    order.items.map(item => item.product_name);

const hasDuplicates =
    productNames.length !==
    new Set(productNames).size;

if (hasDuplicates) {
    return res.status(400).json({
        message:
        "Duplicate products are not allowed"
    });
}

const totalAmount = order.items.reduce(
    (total, item) =>
        total + (item.quantity * item.price),
    0
);

console.log("Total Amount:", totalAmount);

const [newOrder] = await connection.query(
  `
  INSERT INTO orders
  (user_id, order_date, total_amount)
  VALUES (?, ?, ?)
  `,
  [
    userId,
    order.order_date,
    totalAmount
  ]
);

const orderId = newOrder.insertId;

console.log("Order Created:", orderId);

for (const item of order.items) {

    await connection.query(
        `
        INSERT INTO order_items
        (order_id, product_name, quantity, price)
        VALUES (?, ?, ?, ?)
        `,
        [
            orderId,
            item.product_name,
            item.quantity,
            item.price
        ]
    );

}

await connection.commit();

    console.log(user);
    console.log(order);

   return res.status(201).json({
    message: "Order Created Successfully",
    orderId,
    summary: {
        userId,
        totalItems: order.items.length,
        totalAmount
    }
});
  } catch (error) {

     if(connection){
        await connection.rollback();
    }

    res.status(500).json({
      message: error.message,
    });
  }
  finally{

    if(connection){
        connection.release();
    }

}
};

 // Get order by ID
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      `
      SELECT
        u.user_id,
        u.full_name,
        u.email,
        u.mobile,
        u.status,

        o.order_id,
        o.order_date,
        o.total_amount,

        oi.item_id,
        oi.product_name,
        oi.quantity,
        oi.price

      FROM orders o

      JOIN users u
      ON o.user_id = u.user_id

      JOIN order_items oi
      ON o.order_id = oi.order_id

      WHERE o.order_id = ?
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const response = {
      user: {
        user_id: rows[0].user_id,
        full_name: rows[0].full_name,
        email: rows[0].email,
        mobile: rows[0].mobile,
        status: rows[0].status,
      },

      order: {
        order_id: rows[0].order_id,
        order_date: rows[0].order_date,
        total_amount: rows[0].total_amount,
      },

      items: rows.map((row) => ({
        item_id: row.item_id,
        product_name: row.product_name,
        quantity: row.quantity,
        price: row.price,
      })),
    };

    return res.status(200).json(response);

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createOrder,
   getOrderById
};
