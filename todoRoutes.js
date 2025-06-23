const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();
const db = admin.firestore();

const isAuthenticated = async (req, res, next) => {
    const sessionCookie = req.cookies.__session || '';
    try {
        const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true);
        req.user = decodedClaims;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Unauthorized: Please log in.' });
    }
};

router.use(isAuthenticated);

router.get('/', async (req, res) => {
    try {
        const userId = req.user.uid;
        const todosRef = db.collection('todos').doc(userId).collection('tasks');
        const snapshot = await todosRef.orderBy('createdAt', 'desc').get();
        const todos = [];
        snapshot.forEach(doc => {
            todos.push({ id: doc.id, ...doc.data() });
        });
        res.status(200).json(todos);
    } catch (error) {
        console.error('Error fetching todos:', error);
        res.status(500).json({ error: 'Failed to fetch todos.' });
    }
});

router.post('/', async (req, res) => {
    const { name, description, timeline } = req.body;
    if (!name || !timeline) {
        return res.status(400).json({ error: 'Task name and timeline are required.' });
    }
    try {
        const userId = req.user.uid;
        const newTask = {
            name,
            description: description || '',
            timeline: new Date(timeline),
            completed: false,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        };
        const docRef = await db.collection('todos').doc(userId).collection('tasks').add(newTask);
        res.status(201).json({ id: docRef.id, ...newTask });
    } catch (error) {
        console.error('Error adding todo:', error);
        res.status(500).json({ error: 'Failed to add todo.' });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    try {
        const userId = req.user.uid;
        if (updates.timeline && typeof updates.timeline === 'string') {
            updates.timeline = new Date(updates.timeline);
        }
        await db.collection('todos').doc(userId).collection('tasks').doc(id).update(updates);
        res.status(200).json({ message: 'Todo updated successfully!' });
    } catch (error) {
        console.error('Error updating todo:', error);
        res.status(500).json({ error: 'Failed to update todo.' });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const userId = req.user.uid;
        await db.collection('todos').doc(userId).collection('tasks').doc(id).delete();
        res.status(200).json({ message: 'Todo deleted successfully!' });
    } catch (error) {
        console.error('Error deleting todo:', error);
        res.status(500).json({ error: 'Failed to delete todo.' });
    }
});

module.exports = router;