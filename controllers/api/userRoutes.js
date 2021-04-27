const router = require('express').Router();
const { User } = require('../../models');

router.post('/', async (req, res) => {
  try {
    const addUser = await User.create(req.body);

    req.session.save(() => {
      req.session.user_id = addUser.id;
      req.session.logged_in = true;

      res.status(200).json(addUser);
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/login', async (req, res) => {
  try {
    const addUser = await User.findOne({ where: { email: req.body.email } });

    if (!addUser) {
      res
        .status(400)
        .json({ message: 'Incorrect email , please try again' });
      return;
    }

    const validPassword = await addUser.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect password, please try again' });
      return;
    }

    req.session.save(() => {
      req.session.user_id = addUser.id;
      req.session.logged_in = true;
      
      res.json({ user: addUser, message: 'You are now logged in!' });
    });

  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;