const db = require('../models');
const Demo = db.Demo;

exports.queries = (req, res) => {
    Demo.findAll()
        .then(result => {
            return res.json(result)
        })
        .catch((error) => {
            console.error('Failed to fetch data : ', error);
        });

    Demo.bulkCreate([
        {
            id: 6,
            name: 'Product 6',
            address: 'aaa',
            state: 'ddd',
        }
    ], { updateOnDuplicate: ["name", "state"] })
}

exports.create = (req, res) => {

    Demo.bulkCreate([
        {
            id: 6,
            name: 'uuu',
            address: 'aaa',
            state: 'ddd',
        }
    ])
        .then(function () {
            return Demo.findAll()
        })
        .catch((error) => {
            console.error('Failed to fetch data : ', error);
        });




    // db.query('insert into react.reactmysql (name,country,age) values (?,?,?)', {
    //     replacements: [name, country, age],
    //     type: db.QueryTypes.INSERT
    // })
    //     .then(result => {
    //         return res.json(result);
    //     }).catch((error) => {
    //         console.error('Failed to fetch data : ', error);
    //     });
}
// app.post('/update/:id', (req, res) => {
//     const id = req.params.id
//     const name = req.body.name;
//     const country = req.body.country;
//     const age = req.body.age;

//     db.query('update react.reactmysql set name = ?,country = ?,age = ? where id=?', {
//         replacements: [name, country, age, id],
//         type: db.QueryTypes.UPDATE
//     })
//         .then(result => {
//             return res.json(result);
//         }).catch((error) => {
//             console.error('Failed to fetch data : ', error);
//         });

//     // db.query('update react.reactmysql set name = ?,country = ?,age = ? where id=?', [name, country, age, id], (err, result) => {
//     //     if (err) return res.json(err);
//     //     console.log(result);
//     //     return res.json(result);
//     // })
// })

// app.delete('/delete/:id', (req, res) => {
//     const id = req.params.id;

//     db.query('delete from react.reactmysql WHERE id= ?', {
//         replacements: [id],
//         type: db.QueryTypes.DELETE
//     })
//         .then(result => {
//             return res.json(result);
//         }).catch((error) => {
//             console.error('Failed to fetch data : ', error);
//         });
//     // db.query("delete from react.reactmysql WHERE id= ?", id, (err, result) => {
//     //     if (err) {
//     //         console.log(err)
//     //     }
//     // })
// })
