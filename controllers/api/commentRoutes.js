const router = require('express').Router();
const { Comments } = require('../../models');
const withAuth = require('../../utils/auth');


router.post('/', withAuth, async (req, res) => {
  try {
    const addComment = await Comments.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(200).json(addComment);
  } catch (err) {
    res.status(400).json(err);
  }
});


router.delete('/:id', withAuth, async (req, res) => {
  try {
    const delComment = await Comments.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!delComment) {
      res.status(404).json({ message: 'No comments found with this id!' });
      return;
    }

    res.status(200).json(delComment);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;