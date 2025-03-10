import React, { useState } from 'react';
import { FaUser } from 'react-icons/fa'; 
import { CgProfile } from 'react-icons/cg';
import { NavLink } from 'react-router-dom';
import { AiOutlineDelete } from 'react-icons/ai';

export default function Forum({ role }) {
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'aiyush22',
      query: 'In question 5 of assignment 5, can we use the Laplace equation instead of using the boundary value approach, I am having some doubts regarding this. If anybody has solved then please reply.\nI have put the equation in contention for all to see.',
      replies: [
        {
          id: 1,
          author: 'aiyush22',
          content: 'The equation can\'t be used as it does not satisfy the initial conditions of the problem.\n\nTherefore, we must use the Laplace Equation.\n\nHope you understood the answer!'
        }
      ]
    },
    {
      id: 2,
      query: 'Can we use calculator in mid-sem exams?',
      author: 'aiyush22',
      replies: [
        {
          id: 1,
          author: 'raghurao (Instructor)',
          content: 'Yes, you may bring a calculator with you.\n\nBut the design of questions will be such that you wouldn\'t need a calculator to solve any question.'
        }
      ]
    }
  ]);

  const [newQuery, setNewQuery] = useState('');
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [replyingToPost, setReplyingToPost] = useState(null);
  const [replyContent, setReplyContent] = useState('');

  // Delete a post by filtering it out of the posts state
  const handleDeletePost = (postId) => {
    setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
  };

  const handleDeleteReply = (postId, replyId) => {
    setPosts(prevPosts => prevPosts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          replies: post.replies.filter(reply => reply.id !== replyId)
        };
      }
      return post;
    }));
  };

  const handleAddPost = () => {
    setShowNewPostForm(true);
  };

  const handleSubmitPost = (e) => {
    e.preventDefault();
    if (newQuery.trim()) {
      const newPost = {
        id: posts.length + 1,
        author: 'currentUser',
        query: newQuery,
        replies: []
      };
      setPosts([...posts, newPost]);
      setNewQuery('');
      setShowNewPostForm(false);
    }
  };

  const handleReplyClick = (postId) => {
    setReplyingToPost(postId);
    setReplyContent('');
  };

  const handleCancelReply = () => {
    setReplyingToPost(null);
    setReplyContent('');
  };

  const handleSubmitReply = (postId) => {
    if (replyContent.trim()) {
      const updatedPosts = posts.map(post => {
        if (post.id === postId) {
          const newReply = {
            id: post.replies.length + 1,
            author: 'currentUser',
            content: replyContent
          };
          return {
            ...post,
            replies: [...post.replies, newReply]
          };
        }
        return post;
      });
      
      setPosts(updatedPosts);
      setReplyingToPost(null);
      setReplyContent('');
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center w-full h-full ml-9">
      <div className="flex items-center justify-between w-full mb-6 sticky top-0 bg-[#F5F5F5] shadow-lg px-8">
        <div className="flex items-center h-[100px]">
          <h1 className="text-3xl font-bold">FORUM</h1>
          <button 
            className="bg-blue-500 shadow-lg hover:scale-95 transition-all duration-200 text-white px-4 py-2 rounded-md ml-4"
            onClick={handleAddPost}>
            Add Post
          </button>
        </div>
        <NavLink to="/dashboard/profile">
          <CgProfile className='text-[40px] cursor-pointer hover:scale-95 transition-all duration-200 hover:text-blue-500' />
        </NavLink>
      </div>

      {showNewPostForm && (
        <div className="bg-white p-4 rounded-md shadow-md mb-6 w-[95%]">
          <form onSubmit={handleSubmitPost}>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md mb-2 px-6"
              placeholder="Your Query"
              value={newQuery}
              onChange={(e) => setNewQuery(e.target.value)}
              required />
            <div className="flex justify-end">
              <button 
                className='mr-4 bg-gray-300 shadow-lg rounded-md px-4 py-2 hover:scale-95 transition-all duration-200'
                onClick={() => setShowNewPostForm(false)}>
                Cancel
              </button>
              <button 
                type="submit" 
                className="bg-blue-500 shadow-lg text-white px-4 py-2 rounded-md duration-200 transition-all hover:scale-95">
                Submit
              </button>
            </div>
          </form>
        </div>
      )}

      {posts.map((post) => (
        <div key={post.id} className="bg-gray-200 rounded-md shadow-md mb-6 w-[95%]">
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className='flex items-center'>
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-500 mr-2">
                  <FaUser className="h-6 w-6" />
                </div>
                <span className="text-sm text-gray-600">{post.author}</span>
              </div>
              {role !== 'student' && (
                <AiOutlineDelete 
                  className='text-red-600 mr-4 text-[28px] hover:scale-110 transition-all duration-200'
                  onClick={() => handleDeletePost(post.id)}
                />
              )}
            </div>
            {post.query && (
              <div className="bg-white p-4 rounded-md mb-4">
                <p className="whitespace-pre-line">{post.query}</p>
              </div>
            )}
            <div className="mt-4">
              <h3 className="font-medium mb-2">Replies</h3>
              {post.replies.map((reply) => (
                <div key={reply.id} className="bg-white p-4 rounded-md mb-2">
                  <div className="flex items-center justify-between mb-2">
                    <div className='flex items-center'>
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-500 mr-2">
                        <FaUser className="h-4 w-4" /> 
                      </div>
                      <span className="text-sm text-gray-600">{reply.author}</span>
                    </div>
                    {role !== 'student' && (
                      <AiOutlineDelete 
                        className='text-red-600 text-[28px] hover:scale-110 transition-all duration-200'
                        onClick={() => handleDeleteReply(post.id, reply.id)}
                      />
                    )}
                  </div>
                  <p className="whitespace-pre-line">{reply.content}</p>
                </div>
              ))}
              {replyingToPost === post.id ? (
                <div className="bg-white p-4 rounded-md mb-2">
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded-md mb-2"
                    rows="3"
                    placeholder="Write your reply..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                  ></textarea>
                  <div className="flex justify-end gap-2">
                    <button 
                      className="bg-gray-300 shadow-lg text-black px-4 py-2 rounded-md hover:scale-95 transition-all duration-200"
                      onClick={handleCancelReply}>
                      Cancel
                    </button>
                    <button 
                      className="bg-blue-500 hover:scale-95 transition-all duration-200 shadow-lg text-white px-4 py-2 rounded-md"
                      onClick={() => handleSubmitReply(post.id)}>
                      Submit
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-end mt-2">
                  <button 
                    className="bg-black text-white px-4 py-2 rounded-md hover:scale-95 transition-all duration-200 hover:bg-blue-500"
                    onClick={() => handleReplyClick(post.id)}>
                    Reply
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}