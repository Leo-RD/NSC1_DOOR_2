<?php
declare(strict_types=1);
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Middleware\JwtMiddleware;
use App\Middleware\JwtHelper;
use Slim\App;

return function (App $app) {
    // Public route (login)
    $app->post('/login', function (Request $request, Response $response) {
    $params = (array)$request->getParsedBody();
    $username = $params['username'];
    $password = $params['password'];

        // Verify user credentials (this is a simple example, in production use a secure method)
        if ($username === 'NSC1_API' && $password === 'Jone_Porte!87-/') {
        $userData = ['id' => 1, 'username' => $username];

        // Generate JWT token
        $token = JwtHelper::generateToken($userData);

        // Return token in response
        $response->getBody()->write(json_encode(['token' => $token]));
        return $response->withHeader('Content-Type', 'application/json');
        }
    // If credentials are invalid, return 401 Unauthorized
    $response->getBody()->write(json_encode(['error' => 'Invalid credentials']));
    return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
    });

    // Protected route (example)
    $app->get('/protected', function (Request $request, Response $response) {
    // Access user data from token
    $user = $request->getAttribute('user');
    $response->getBody()->write(json_encode(['message' => 'Hello, ' . $user->username]));
    return $response->withHeader('Content-Type', 'application/json');
})->add(new JwtMiddleware());
};