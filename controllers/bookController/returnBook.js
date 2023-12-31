import * as userModel from '../../models/userModal.js';
import * as bookModel from '../../models/bookModal.js';

export const returnBook = async (req, res) => {
  try {
    // Check the role of the user making the request
    const { role } = req.login;

    // If the user is an admin, disallow returning books
    if (role === 'admin') {
      return res.status(403).json({ message: 'Admins are not allowed to lend or return books.' });
    }
    
    let bookId;

    if (req.params.id) {
      bookId = parseInt(req.params.id);    
  } else if (req.body.bookId) {
      bookId = req.body.bookId;
  } else {
      return res.status(400).json({ error: 'Book ID not provided in URL or request body' });
    }

    // Fetch user ID from the authenticated user's token
    const userId = req.login.id;

    // Get user and book details using models
    const users = await userModel.getUsers();
    const books = await bookModel.getBooks();

    // Find the user by ID
    const user = users.find((user) => user.id === userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the book in the user's lent books
    const lentBookIndex = user.lentBooks.findIndex((lentBook) => lentBook.bookId === bookId);

    if (lentBookIndex === -1) {
      return res.status(404).json({ message: 'Book not found in the user\'s lent books' });
    }

    // Retrieve the lent book details
    const lentBook = user.lentBooks[lentBookIndex];

    // Find the book by ID
    const book = books.find((book) => book.id === bookId);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Calculate charges until the return date
    const lendingPrice = book.lendingPrice;
    const days = calculateDaysDifference(lentBook.timestamp, new Date().toISOString());
    const initialCharge = lendingPrice;
    const additionalCharge = days > 9 ? 5 * (days - 9) : 0;
    const totalCharge = initialCharge + additionalCharge;

    // Clear the lent book from the user's lentBooks array
    user.lentBooks.splice(lentBookIndex, 1);

    // Increase the book quantity
    book.quantity++;

    // Write the updated data back using models
    await userModel.saveUsers(users);
    await bookModel.saveBooks(books);

    res.json({
      message: 'Book returned successfully',
      chargeDetails: {
        initialCharge,
        additionalCharge,
        totalCharge,
        days,
      },
    });
  } catch (err) {
    console.error('Error returning book:', err);
    res.status(500).send('Internal Server Error');
  }
};

// Function to calculate the difference in days between two dates
function calculateDaysDifference(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const timeDifference = Math.abs(end - start);
  return Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
}
