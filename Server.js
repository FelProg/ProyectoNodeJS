//1. Invocamos a express
const express = require('express');

const app = express();

// 2. Para capturar datos de formularios
app.use(express.urlencoded({extended:false}));
app.use(express.json());

//3. Invocamos a dotenv para la migración de credenciales
const dotenv = require('dotenv');
dotenv.config({path:'./env/.env'})

//4. El directorio public para los recursos estaticos 
app.use('/resources', express.static('public'));
app.use('/resources', express.static(__dirname + '/public'));

// 5. Motor de plantilla para utlizar en las vistas .ejs
app.set('view engine', 'ejs');

//6. Invocamos a bcypt para la encriptacion de contraseña
const bcryptjs = require('bcrypt');

//7. Variables de sesion
const session = require('express-session');
app.use(session({
    secret:'secret',
    resave: true,
    saveUninitialized:true
}));

//8. Invocamos al modulo de conexion de la base de datos.
const connection = require('./database/db');

//9. Estableciendo las rutas

app.get('/login', (req,res)=>{
    res.render('login');
});

app.get('/register', (req,res)=>{
    res.render('register');
});

//11. Autenticacion
app.post('/auth',(req,res)=>{
    const user = req.body.user;
    const pass = req.body.pass;


    if(user && pass){
        connection.query('select * from usuarios where nombre = ? and pass = ?',[user, pass],(error,results)=>{
            if(results.length == 0 ){
                // res.send("no");
                res.render('login',{
                    alert:true,
                    alerTitle: 'Error',
                    alertText: 'Usuario y/o password incorrectos',
                    alertIcon: "error",
                    ruta: '/login'
                });
                                      
            }else{
                // res.send("si");
                req.session.loggedin = true;
                req.session.nombre = results[0].nombre
                res.render('login',{
                    alert:true,
                    alerTitle: 'Conexión exitosa',
                    alertText: 'Bienvenido '+results[0].nombre,
                    alertIcon: "success",
                    ruta: '/'
                });
                                 
            }
        })
    }else{
        res.render('login',{
            alert:true,
            alerTitle: 'Error',
            alertText: 'Debe rellenar todos los campos',
            alertIcon: "warning",
            ruta: '/login'
        });
    }
});

//12. Auth pages
app.get("/", (req,res)=>{
    if(req.session.loggedin){
        res.render('index',{
            loggedin: true,
            name: req.session.nombre
        });
    }else{
        res.render('index',{
            loggedin: false,
            name : 'Presione para iniciar sesión'
        })
    }
})

// 13 logout
app.get('/logout',(req,res)=>{
    req.session.destroy(()=>{
        res.redirect('/');
    })
})

//14 listado de carreras
app.get('/carreras',(req,res)=>{
    if(!req.session.loggedin){
        res.render('index',{
            loggedin: false,
            name : 'Presione para iniciar sesion'
        })
    }else{
        connection.query('select * from carreras', (error,results)=>{

        
            if(results.length == 0 ){
                
                res.render('carreras',{
                    alert:true,
                    alerTitle: 'Error',
                    alertText: 'No se encuentran carreras disponibles',
                    alertIcon: "error",
                    ruta: '/'
                });
                                      
            }else{
                
                res.render('carreras',{
                    datos : results,
                    estado : 'si entro'
                    
                });
            }
        })
    }
});

//15 Listado de materias
app.get('/materias',(req,res)=>{
    if(!req.session.loggedin){
        res.render('index',{
            loggedin: false,
            name : 'Presione para iniciar sesion'
        })
    }else{
        connection.query('select * from materias', (error,results)=>{

        
            if(results.length == 0 ){
                
                res.render('materias',{
                    alert:true,
                    alerTitle: 'Error',
                    alertText: 'No se encuentran materias disponibles',
                    alertIcon: "error",
                    ruta: '/'
                });
                                      
            }else{
                
                res.render('materias',{
                    datos : results,
                    
                    
                });
            }
        })
    }
});
      
//16 Listado de alumnos, vista para agregar alumnos, operacion para agregar alumnos. 
app.get('/alumnos',(req,res)=>{
    if(!req.session.loggedin){
        res.render('index',{
            loggedin: false,
            name : 'Presione para iniciar sesion'
        })
    }else{
        connection.query('select * from alumnos', (error,results)=>{

        
            if(results.length == 0 ){
                
                res.render('alumnos',{
                    alert:true,
                    alerTitle: 'Error',
                    alertText: 'No se encuentran alumnos disponibles',
                    alertIcon: "error",
                    ruta: '/'
                });
                                      
            }else{
                
                res.render('alumnos',{
                    datos : results,
                    
                });
            }
        })
    }
});

app.get('/agregarAlumnos',(req,res)=>{
    res.render('agregarAlumnos')
})

app.post('/guardarAlumno',(req,res)=>{
    const nombre = req.body.nombre;
    const apellido1 = req.body.apellido1;
    const apellido2 = req.body.apellido2;
    const ciudad = req.body.ciudad;
    const modalidad = req.body.modalidad;

    connection.query('insert into alumnos set ?',{nombre:nombre,apellido1:apellido1,apellido2:apellido2,ciudad:ciudad,modalidad:modalidad}, (error,results)=>{
        if(error)
            throw error
        
        res.redirect('/alumnos')
    })

})

//17 Listado de carreras, vista para agregar carreras, operacion para agregar carreras. 
app.get('/carreras',(req,res)=>{
    if(!req.session.loggedin){
        res.render('index',{
            loggedin: false,
            name : 'Presione para iniciar sesion'
        })
    }else{
        connection.query('select * from carreras', (error,results)=>{

        
            if(results.length == 0 ){
                
                res.render('carreras',{
                    alert:true,
                    alerTitle: 'Error',
                    alertText: 'No se encuentran carreras disponibles',
                    alertIcon: "error",
                    ruta: '/'
                });
                                      
            }else{
                
                res.render('carreras',{
                    datos : results,
                    
                });
            }
        })
    }
});

app.get('/agregarCarreras',(req,res)=>{
    res.render('agregarCarreras')
})

app.post('/guardarCarrera',(req,res)=>{
    const nombre = req.body.nombre;
    const division = req.body.division;
   

    connection.query('insert into carreras set ?',{nombre:nombre, division:division}, (error,results)=>{
        if(error)
            throw error
        
        res.redirect('/carreras')
    })

})

//18 Listado de materias, vista para agregar materias, operacion para agregar materias. 
app.get('/materias',(req,res)=>{
    if(!req.session.loggedin){
        res.render('index',{
            loggedin: false,
            name : 'Presione para iniciar sesion'
        })
    }else{
        connection.query('select * from materias', (error,results)=>{

        
            if(results.length == 0 ){
                
                res.render('materias',{
                    alert:true,
                    alerTitle: 'Error',
                    alertText: 'No se encuentran materias disponibles',
                    alertIcon: "error",
                    ruta: '/'
                });
                                      
            }else{
                
                res.render('materias',{
                    datos : results,
                    
                });
            }
        })
    }
});

app.get('/agregarMaterias',(req,res)=>{
    res.render('agregarMaterias')
})

app.post('/guardarMateria',(req,res)=>{
    const nombre = req.body.nombre;
    const maestro = req.body.maestro;
   

    connection.query('insert into materias set ?',{nombre:nombre, maestro:maestro}, (error,results)=>{
        if(error)
            throw error
        
        res.redirect('/materias')
    })

})





app.listen(3000,(req,res)=>{
    console.log('EJECUTANDO EN http://localhost:3000');
});

