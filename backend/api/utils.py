from difflib import SequenceMatcher

def get_best_match(user_input, names):
    """
    Returns the name with the highest similarity to the user input.
    Uses sequence matching for fuzzy string comparison.
    
    Args:
        user_input (str): Name entered by the user.
        names (List[str]): List of sanctioned entity names.

    Returns:
        Tuple[int, str]: Score (0-100) and the best matching name.
    """
    best_score = 0
    best_name = None

    for name in names:
        score = SequenceMatcher(None, user_input.lower(), name.lower()).ratio()
        if score > best_score:
            best_score = score
            best_name = name

    return int(best_score * 100), best_name

def get_risk_level(score):
    """
    Classifies the match score into a risk level category.

    Args:
        score (int): Match score between 0-100.

    Returns:
        str: Risk level ('low', 'medium', or 'high').
    """
    if score >= 80:
        return 'high'
    elif score >= 50:
        return 'medium'
    return 'low'
