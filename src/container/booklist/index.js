"use client";

import React, { useEffect, useState } from "react";
import { FaSave, FaChevronLeft, FaChevronRight } from "react-icons/fa"; // Added arrow icons
import { RiEdit2Fill } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import "../../../input.css";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [editIndex, setEditIndex] = useState(-1);
  const [editedBook, setEditedBook] = useState({
    id: "",
    title: "",
    author: "",
    year: "",
  });
  const [userRole, setUserRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 7;

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:3000/api/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `query Docs {
              listBooks(limit: 50) {
                docs {
                  id
                  title
                  author
                  year
                  createdOn
                  updatedOn
                }
              }
            }`,
          }),
        });

        const data = await response.json();
        if (data.errors) {
          console.error("GraphQL Error:", data.errors[0].message);
          alert("Error fetching books: " + data.errors[0].message);
        } else {
          setBooks(data.data.listBooks.docs || []);
        }
      } catch (error) {
        console.error("Error fetching books:", error);
        alert("An error occurred while fetching books.");
      } finally {
        setLoading(false);
      }
    };

    const role = sessionStorage.getItem("role");
    setUserRole(role);
    fetchBooks();
  }, []);

  const handleEdit = (index) => {
    const bookToEdit = books[index];
    setEditedBook(bookToEdit);
    setEditIndex(index);
  };

  const handleSave = async () => {
    if (!editedBook.title) {
      alert("No book selected for editing.");
      return;
    }

    const confirmUpdate = window.confirm(
      `Are you sure you want to update the book "${editedBook.title}"?`
    );

    if (confirmUpdate) {
      const updatedBooks = [...books];
      updatedBooks[editIndex] = editedBook;
      setBooks(updatedBooks);
      setEditIndex(-1);
      setEditedBook({
        id: "",
        title: "",
        author: "",
        year: "",
      });

      try {
        const response = await fetch("http://localhost:3000/api/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `mutation UpdateBook($input: updateBookInput!) {
              updateBook(input: $input) {
                title
                author
                year
              }
            }`,
            variables: {
              input: {
                id: editedBook.id,
                title: editedBook.title,
                author: editedBook.author,
                year: editedBook.year,
              },
            },
          }),
        });

        const data = await response.json();
        if (data.errors) {
          console.error("GraphQL Error:", data.errors[0].message);
          alert("Error updating book: " + data.errors[0].message);
        }
      } catch (error) {
        console.error("Error updating book:", error);
        alert("An error occurred while updating the book.");
      }
    }
  };

  const handleRemove = async (index) => {
    const bookIndex = currentPage * itemsPerPage + index;
    const bookToRemove = books[bookIndex];

    const confirmDelete = window.confirm(
      `Are you sure you want to delete the book "${bookToRemove.title}"?`
    );
    if (confirmDelete) {
      try {
        const response = await fetch("http://localhost:3000/api/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `mutation DeleteBook($deleteBookId: ID!) {
              deleteBook(id: $deleteBookId)
            }`,
            variables: {
              deleteBookId: bookToRemove.id,
            },
          }),
        });

        const data = await response.json();
        if (data.errors) {
          console.error("GraphQL Error:", data.errors[0].message);
          alert("Error deleting book: " + data.errors[0].message);
        } else {
          const updatedBooks = books.filter((_, i) => i !== bookIndex);
          setBooks(updatedBooks);
        }
      } catch (error) {
        console.error("Error deleting book:", error);
        alert("An error occurred while deleting the book.");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedBook((prev) => ({ ...prev, [name]: value }));
  };

  const totalPages = Math.ceil(books.length / itemsPerPage);
  const currentBooks = books.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="sm:mb-10">
      <h2 className="text-xl font-bold my-4 text-center md:text-2xl">
        Books List
      </h2>
      {loading ? (
        <div className="text-center text-sm">Fetching books.....</div>
      ) : books.length === 0 ? (
        <div className="text-center text-sm font-semibold">
          No books available.
        </div>
      ) : (
        <div>
          {/* For mobile view */}
          <div className="flex justify-center">
            <div className="md:hidden">
              <div className="flex flex-col items-center">
                {currentBooks.map((book, index) => {
                  const originalIndex = currentPage * itemsPerPage + index;

                  return (
                    <div
                      key={book.id}
                      className="border border-gray-300 p-2 mb-2 rounded-lg"
                    >
                      <table className="w-full">
                        <tbody>
                          <tr>
                            <td className="font-bold">Book Title:</td>
                            <td className="pl-2">
                              {editIndex === originalIndex ? (
                                <input
                                  type="text"
                                  name="title"
                                  value={editedBook.title}
                                  onChange={handleChange}
                                  className="mobile-edit"
                                />
                              ) : (
                                <span className="text-lg">{book.title}</span>
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td className="font-bold">Author:</td>
                            <td className="pl-2">
                              {editIndex === originalIndex ? (
                                <input
                                  type="text"
                                  name="author"
                                  value={editedBook.author}
                                  onChange={handleChange}
                                  className="mobile-edit"
                                />
                              ) : (
                                <span className="text-lg">{book.author}</span>
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td className="font-bold">Year:</td>
                            <td className="pl-2">
                              {editIndex === originalIndex ? (
                                <input
                                  type="text"
                                  name="year"
                                  value={editedBook.year}
                                  onChange={handleChange}
                                  className="mobile-edit"
                                />
                              ) : (
                                <span className="text-lg">{book.year}</span>
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td className="font-bold">Created On:</td>
                            <td className="pl-2">
                              <span className="text-lg">
                                {new Date(book.createdOn).toLocaleDateString()}
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className="font-bold">Updated On:</td>
                            <td className="pl-2">
                              <span className="text-lg">
                                {new Date(book.updatedOn).toLocaleDateString()}
                              </span>
                            </td>
                          </tr>
                          {userRole === "ADMIN" && (
                            <tr>
                              <td colSpan="2">
                                <div className="flex justify-around">
                                  {editIndex === originalIndex ? (
                                    <FaSave
                                      onClick={handleSave}
                                      className="icons text-green-500"
                                    />
                                  ) : (
                                    <>
                                      <RiEdit2Fill
                                        onClick={() =>
                                          handleEdit(originalIndex)
                                        }
                                        className="icons text-blue-500"
                                      />
                                      <MdDelete
                                        onClick={() =>
                                          handleRemove(originalIndex)
                                        }
                                        className="icons text-red-500"
                                      />
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* For larger screens */}
          <div className="hidden md:block overflow-x-auto my-0 mx-5">
            <table className="min-w-full table-auto md:table-fixed border-collapse">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="book-list-col">Book Title</th>
                  <th className="book-list-col">Author</th>
                  <th className="book-list-col1">Year</th>
                  <th className="book-list-col1">Created On</th>
                  <th className="book-list-col1">Updated On</th>
                  {userRole === "ADMIN" && (
                    <th className="book-list-col2">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {currentBooks.map((book, index) => {
                  const originalIndex = currentPage * itemsPerPage + index;

                  return (
                    <tr key={book.id} className="border-b border-gray-300">
                      <td className="border-2 border-gray-300 text-center text-base md:text-xl md:p-2">
                        {editIndex === originalIndex ? (
                          <input
                            type="text"
                            name="title"
                            value={editedBook.title}
                            onChange={handleChange}
                            className="tab-edit border rounded px-2"
                          />
                        ) : (
                          book.title
                        )}
                      </td>
                      <td className="border-2 border-gray-300 text-center text-base md:text-xl md:p-2">
                        {editIndex === originalIndex ? (
                          <input
                            type="text"
                            name="author"
                            value={editedBook.author}
                            onChange={handleChange}
                            className="tab-edit border rounded px-2"
                          />
                        ) : (
                          book.author
                        )}
                      </td>
                      <td className="border-2 border-gray-300 text-center text-base md:text-xl md:p-2">
                        {editIndex === originalIndex ? (
                          <input
                            type="text"
                            name="year"
                            value={editedBook.year}
                            onChange={handleChange}
                            className="tab-edit border rounded px-2"
                          />
                        ) : (
                          book.year
                        )}
                      </td>
                      <td className="border-2 border-gray-300 text-center text-base md:text-xl md:p-2">
                        {new Date(book.createdOn).toLocaleDateString()}
                      </td>
                      <td className="border-2 border-gray-300 text-center text-base md:text-xl md:p-2">
                        {new Date(book.updatedOn).toLocaleDateString()}
                      </td>
                      {userRole === "ADMIN" && (
                        <td className="border-2 border-gray-300">
                          <div className="flex justify-around">
                            {editIndex === originalIndex ? (
                              <FaSave
                                onClick={handleSave}
                                className="icons text-green-500"
                              />
                            ) : (
                              <>
                                <RiEdit2Fill
                                  onClick={() => handleEdit(originalIndex)}
                                  className="icons text-blue-500"
                                />
                                <MdDelete
                                  onClick={() => handleRemove(originalIndex)}
                                  className="icons text-red-500"
                                />
                              </>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="fixed bottom-0 left-0 right-0 bg-white p-2 flex justify-center shadow-lg ">
            <button
              onClick={() => handlePageClick(currentPage - 1)}
              disabled={currentPage === 0}
              className={`p-1 rounded-lg text-gray-800 md:px-2 md:py-2 md:bg-blue-600 md:text-white md:hover:bg-blue-70 md:mr-6`}
            >
              <FaChevronLeft />
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => handlePageClick(index)}
                className={`mx-1 rounded-lg ${
                  currentPage === index
                    ? "bg-blue-600 text-white" 
                    : "bg-gray-200" 
                } px-2 md:px-2 md:py-1`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageClick(currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
              className={`p-1 rounded-lg text-gray-800 md:px-2 md:py-2 md:bg-blue-600 md:text-white md:hover:bg-blue-700 md:ml-6`}
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookList;
