const express=require('express');
const pg= require('pg');
const cors=require('cors');
const db={
    user: 'postgres',
    host: 'localhost',
    database:'gorilatype',
    password:'1234', //contraseña de pgadmin
    port:'5432'
}
const app=express();
const port =3000;
const pool = new pg.Pool(db);

app.use(express.json());
app.get('/', (req, res) => {
  res.send('¡Hola desde mi API de biblioteca con PostgreSQL!');
});

app.listen(port, () => {
  console.log(`Servidor Express escuchando en http://localhost:${port}`);
});

app.get('/api/palabra',async (req,res)=>{
    try {
        //devuelve un array de por si
        const resp=await pool.query('select * from palabra');//parametros de postgres, mysqp=? postgres=$1,$2 orden del array
        let resp_array=resp.rows;
        res.json(resp_array);
    } catch (error) {
        console.error('algo ha ocurrido',error);
        res.status(500).json({message:'No se que paso'});
    }
})
app.post('/api/palabra',async(req,res)=>{
    const {texto_palabra}=req.body;
    try {
        const resp=await pool.query("insert into palabra(texto_palabra) values($1) returning *",[texto_palabra])
        res.status(201).json({message:"creado exitosamente"});
        
    } catch (error) {
        console.error('algo salio mal',error)
        res.status(500).json({message:"No se que paso"})
    }
})
app.put('/api/palabra/:id',async (req,res)=>{
    const {id}=req.params;
    const {pal}=req.body;
    try {
        const resp=await pool.query('update palabra set texto_palabra=$1 where id_palabra=$2',[pal,id]);
        res.status(201).json({message:"Se actualizo completamente"})
    } catch (error) {
        console.error('algo salio mal',error)
        res.status(500).json({message:"No se que paso"})
    }
});

app.delete('/api/palabra/:id', async (req,res)=> {
    const {id}=req.params;
    try {
        const resp=await pool.query('delete from palabra where id_palabra=$1',[id]);
        if(resp.rowCount===0){
            res.status(404).json({message:"no se encuentra el recuros"})
        }
        res.status(200).send();
    } catch (error) {
        console.error('algo salio mal',error)
        res.status(500).json({message:"No se que paso"})
    }
});