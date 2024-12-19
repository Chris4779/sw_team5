<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    public function index(){
        return Article::all();
    }

    public function store(Request $request ){
        $fields = $request->validate([
            'title' => 'required|max:255',
            'description' => 'required|max:500',
            'category' => 'required',
            'event' => 'required'
        ]);

        $article = Article::create([
            'title' => $fields['title'],
            'Description' => $fields['description'],
            'event_idevent' => $fields['event'],
            'acticle_status_idacticle_status' => 1,
            'category_idcategory' => $fields['category'],
            'user_iduser' => auth()->id(),
        ]);

        return response()->json([
            'message' => 'Article created successfully!',
            'article_id' => $article->idarticle,
        ], 201);
    }
    public function getArticles($id)
    {
        try {
            // Fetch articles associated with the given conference ID
            $articles = Article::where('event_idevent', $id)
                ->with('user:iduser,firstname,lastname') // Include user details
                ->get();

            return response()->json($articles, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred while fetching articles.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    public function addArticleReviewer(Request $request, $articleId)
    {
        try {
            // Validate the input
            $request->validate([
                'reviewer_id' => 'required|exists:user,iduser', // Ensure reviewer_id exists in users table
            ]);

            // Find the article by its ID
            $article = Article::findOrFail($articleId);

            // Assign the reviewer_id to the article
            $article->idreviewer = $request->input('reviewer_id');
            $article->save();

            return response()->json([
                'message' => 'Reviewer successfully assigned to the article.',
                'article' => $article,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred while assigning the reviewer.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
