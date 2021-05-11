import axios from 'axios';
import React, { useState } from 'react';
import { useHistory } from 'react-router';
import AppModal from 'src/components/AppModal';
import TemplateCards from 'src/components/TemplateCards';
import { useUser } from 'src/store/userContext';
import { useToken } from 'src/store/useToken';

interface Props {}

const User: React.FC<Props> = () => {
  const { user } = useUser();
  const { token } = useToken();
  const { push } = useHistory();
  const [isModal, setModal] = useState(false);
  const [newTemplate, setTemplate] = useState({ title: '', markup: '' });
  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const target = e.target;
    setTemplate({
      ...newTemplate,
      [target.name]: target.value,
    });
  };

  async function cerateTemplate() {
    axios({
      baseURL: import.meta.env.VITE_API as string,
      url: `/template/`,
      method: 'post',
      headers: {
        'access-token': token,
      },
      data: {
        ...newTemplate,
      },
    })
      .then(
        (res) => (
          setModal(false),
          push(`/template/${res.data.id}`),
          setTemplate({ markup: '', title: '' })
        ),
      )
      .catch((err) => console.log(err));
  }
  return (
    <div className="container">
      <AppModal
        isModal={isModal}
        closeModal={() => setModal(false)}
        heading={'Create new Template'}
      >
        <form
          onSubmit={(e) => (e.preventDefault(), cerateTemplate())}
          className="grid grid-cols-1 gap-6"
        >
          <input
            name="title"
            type="text"
            value={newTemplate.title}
            placeholder="Title"
            onChange={handleInput}
          />

          <textarea
            name="markup"
            value={newTemplate.markup}
            placeholder="Markup"
            onChange={handleInput}
          />
          <div className="flex justify-end">
            <button
              className="p-2 rounded-md bg-red-500 hover:bg-red-600 text-white ml-1"
              onClick={() => setModal(false)}
              type="button"
            >
              Cancel
            </button>
            <button
              className="p-2 rounded-md bg-indigo-500 hover:bg-indigo-600 text-white ml-1"
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
      </AppModal>

      <div>
        <button
          className="bg-indigo-500 p-2 hover:bg-indigo-600 float-right text-white rounded-md"
          onClick={() => setModal(true)}
        >
          Create
        </button>
        <p className="text-3xl font-bold">Dashboard</p>
      </div>
      <p className="text-lg">
        {' '}
        Hii <span className="font-bold"> {user.name} </span> ! Welcome to
        PDF-Donkey.
      </p>
      <p className="text-lg">You can find all of your templates here.</p>
      <TemplateCards />
    </div>
  );
};

export default User;
