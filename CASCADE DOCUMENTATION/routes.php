<?php

declare(strict_types=1);

use App\Infrastructure\DAO\DAO_personne;
use App\Infrastructure\DAO\DAO_eleve;
use App\Infrastructure\DAO\DAO_personnel;
use App\Infrastructure\DAO\DAO_role;
use App\Infrastructure\DAO\DAO_personne_role;
use App\Infrastructure\DAO\DAO_porte;
use App\Infrastructure\DAO\DAO_droit_acces;
use App\Infrastructure\DAO\DAO_acces_log;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\App;

return function (App $app) {

    // Inclusion des routes JWT (fichier dans src/routes)
    (require __DIR__ . '/../src/routes/routesJWT.php')($app);

    $app->options('/{routes:.*}', function (Request $request, Response $response) {
        // CORS Pre-Flight OPTIONS Request Handler
        return $response;
    });

    $app->get('/', function (Request $request, Response $response) {
        $response->getBody()->write("
        
Yesterday, upon the stair,        
I met a man who wasn't there
He wasn't there again today
I wish, I wish he'd go away...

When I came home last night at three
The man was waiting there for me
But when I looked around the hall
I couldn't see him there at all!
Go away, go away, don't you come back any more!
Go away, go away, and please don't slam the door... (slam!)

Last night I saw upon the stair
A little man who wasn't there
He wasn't there again today
Oh, how I wish he'd go away...
");
        return $response;
    });

    /* ================================================================
       TABLE PERSONNE
    ================================================================ */
    $app->get('/personnes', function (Request $request, Response $response) {
        $dao = new DAO_personne($this->get(PDO::class));
        $data = $dao->findAll();
        $response->getBody()->write(json_encode($data));
        return $response->withHeader('Content-Type', 'application/json');
    });

    $app->get('/personnes/{id}', function (Request $request, Response $response, array $args) {
        $dao = new DAO_personne($this->get(PDO::class));
        $data = $dao->findById((int)$args['id']);
        $response->getBody()->write(json_encode($data));
        return $response->withHeader('Content-Type', 'application/json');
    });

    $app->post('/personnes', function (Request $request, Response $response) {
        $dao = new DAO_personne($this->get(PDO::class));
        $id = $dao->insert($request->getParsedBody());
        $response->getBody()->write(json_encode(['id' => $id]));
        return $response->withHeader('Content-Type', 'application/json');
    });

    $app->delete('/personnes/{id}', function (Request $request, Response $response, array $args) {
        $dao = new DAO_personne($this->get(PDO::class));
        $dao->delete((int)$args['id']);
        $response->getBody()->write(json_encode(['status' => 'deleted']));
        return $response->withHeader('Content-Type', 'application/json');
    });


    /* ================================================================
       TABLE ELEVE
    ================================================================ */
    $app->post('/eleves', function (Request $request, Response $response) {
        $dao = new DAO_eleve($this->get(PDO::class));
        $dao->insert($request->getParsedBody());
        $response->getBody()->write(json_encode(['status' => 'eleve ajouté']));
        return $response->withHeader('Content-Type', 'application/json');
    });

    $app->get('/eleves/{id_personne}', function (Request $request, Response $response, array $args) {
        $dao = new DAO_eleve($this->get(PDO::class));
        $data = $dao->findByPersonneId((int)$args['id_personne']);
        $response->getBody()->write(json_encode($data));
        return $response->withHeader('Content-Type', 'application/json');
    });


    /* ================================================================
       TABLE PERSONNEL
    ================================================================ */
    $app->post('/personnels', function (Request $request, Response $response) {
        $dao = new DAO_personnel($this->get(PDO::class));
        $dao->insert($request->getParsedBody());
        $response->getBody()->write(json_encode(['status' => 'personnel ajouté']));
        return $response->withHeader('Content-Type', 'application/json');
    });


    /* ================================================================
       TABLE ROLE & PERSONNE_ROLE
    ================================================================ */
    $app->post('/roles', function (Request $request, Response $response) {
        $dao = new DAO_role($this->get(PDO::class));
        $id = $dao->insert($request->getParsedBody());
        $response->getBody()->write(json_encode(['id_role' => $id]));
        return $response->withHeader('Content-Type', 'application/json');
    });

    $app->post('/personne_role', function (Request $request, Response $response) {
        $dao = new DAO_personne_role($this->get(PDO::class));
        $dao->insert($request->getParsedBody());
        $response->getBody()->write(json_encode(['status' => 'rôle assigné']));
        return $response->withHeader('Content-Type', 'application/json');
    });


    /* ================================================================
       TABLE PORTE
    ================================================================ */
    $app->post('/portes', function (Request $request, Response $response) {
        $dao = new DAO_porte($this->get(PDO::class));
        $id = $dao->insert($request->getParsedBody());
        $response->getBody()->write(json_encode(['id_porte' => $id]));
        return $response->withHeader('Content-Type', 'application/json');
    });


    /* ================================================================
       TABLE DROIT_ACCES
    ================================================================ */
    $app->post('/droit_acces', function (Request $request, Response $response) {
        $dao = new DAO_droit_acces($this->get(PDO::class));
        $dao->insert($request->getParsedBody());
        $response->getBody()->write(json_encode(['status' => 'droit ajouté']));
        return $response->withHeader('Content-Type', 'application/json');
    });


    /* ================================================================
       TABLE ACCES_LOG
    ================================================================ */
    $app->post('/acces_log', function (Request $request, Response $response) {
        $dao = new DAO_acces_log($this->get(PDO::class));
        $dao->insert($request->getParsedBody());
        $response->getBody()->write(json_encode(['status' => 'log ajouté']));
        return $response->withHeader('Content-Type', 'application/json');
    });

    $app->get('/acces_log', function (Request $request, Response $response) {
        $dao = new DAO_acces_log($this->get(PDO::class));
        $data = $dao->findLast(100);
        $response->getBody()->write(json_encode($data));
        return $response->withHeader('Content-Type', 'application/json');
    });

};
