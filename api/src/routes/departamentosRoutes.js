import con from '../services/connection.js'

const departamentosRoutes = (app) => {

  const base = '/api'

  //GET --------------------
  app.get(`${base}/departamentos`, async (req, res) => {

    const [rows] = await con.query('SELECT * FROM DEPARTAMENTOS')

    res.json(rows)
  })

  //POST ------------------
  app.post(`${base}/departamentos`, async (req, res) => {
    
    const { nome, sigla } = req.body

    //validando entradas
    if (!nome || !sigla) {
      res.status(400).json({ message: 'One or more fields are unset'})
      return
    }
    
    try {
      const [result] = await con.query('INSERT INTO DEPARTAMENTOS (nome, sigla) VALUES (?, ?)', [nome, sigla])
      res.status(201).json(result)
    } catch(e) {
      console.error(`[ERROR] ${e}`)
      if (e.code === 'ER_DUP_ENTRY') {
        res.status(409).json({ message: e.message })
        return
      }
      // Se não tiver encontrado o erro, foi algo critico
      res.status(500).json({ message: e.message })
    }

  })


  //PATCH ------------------
  app.patch(`${base}/departamentos`, async (req, res) => {
    const { id_departamento, nome, sigla } = req.body
  
    // Validação de entrada
    if (!id_departamento || (!nome && !sigla)) {
      res.status(400).json({ message: 'Campos não encontrados' })
      return
    }
  
    try {
      let query = 'UPDATE DEPARTAMENTOS SET'
      const values = []
  
      if (nome) {
        query += ' nome = ?,'
        values.push(nome)
      }
  
      if (sigla) {
        query += ' sigla = ?,'
        values.push(sigla)
      }
  
      query = query.slice(0, -1) //DELETO A VIRGULA DA STRING
  
      query += ' WHERE id_departamento = ?'
      values.push(id_departamento)
  
      const [result] = await con.query(query, values)
      res.status(200).json(result)
    } catch (e) {
      console.error(`[ERROR] ${e}`)
      res.status(500).json({ message: 'Error on update record', exception: e })
    }
  })

  //DELETE ---------------------------------
  app.delete(`${base}/departamentos`, async (req, res) => {
    const { id_departamento } = req.body
  
    // Validação de entrada
    if (!id_departamento) {
      res.status(400).json({ message: 'One or more fields are unset' })
      return
    }
  
    try {
      const query = 'DELETE FROM DEPARTAMENTOS WHERE id_departamento = ?'
      const values = [id_departamento]

      const [result] = await con.query(query, values)

      // Valida se o registro existe
      if (result.affectedRows === 0) {
        res.status(404).json({ message: 'Record not found' })
        return
      }

      res.json({ message: 'Record was deleted' })
  
    } catch (e) {
      console.error(`[ERROR] ${e}`)
      res.status(500).json({ message: 'Erro on delete record', exception: e })
    }
  })
  
  
}

export default departamentosRoutes