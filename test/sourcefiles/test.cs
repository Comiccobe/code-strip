#if ENABLED_DIRECTIVE
    THIS LINE SHOULD EXIST
#endif

#if (ENABLED_DIRECTIVE)
    THIS LINE SHOULD EXIST
#endif

THIS LINE SHOULD EXIST

#if ENABLED_DIRECTIVE
    THIS LINE SHOULD EXIST
#else
    THIS LINE NOT SHOULD EXIST
#endif

#if (ENABLED_DIRECTIVE)
    THIS LINE SHOULD EXIST
#else
    THIS LINE SHOULD NOT EXIST
#endif

#if OTHER_SHIT
    THIS LINE SHOULD EXIST
#elif ENABLED_DIRECTIVE
    THIS LINE SHOULD EXIST
#elif MORE_SHIT
    THIS LINE SHOULD EXIST
#else
    THIS LINE SHOULD EXIST
#endif

#if (OTHER_SHIT)
    THIS LINE SHOULD EXIST
#elif (ENABLED_DIRECTIVE)
    THIS LINE SHOULD EXIST
#elif (MORE_SHIT)
    THIS LINE SHOULD EXIST
#else
    THIS LINE SHOULD EXIST
#endif

#if OTHER_SHIT
    THIS LINE SHOULD EXIST
#elif MORE_SHIT
    THIS LINE SHOULD EXIST
#elif ENABLED_DIRECTIVE
    THIS LINE SHOULD EXIST
#else
    THIS LINE SHOULD EXIST
#endif

#if (OTHER_SHIT)
    THIS LINE SHOULD EXIST
#elif (MORE_SHIT)
    THIS LINE SHOULD EXIST
#elif (ENABLED_DIRECTIVE)
    THIS LINE SHOULD EXIST
#else
    THIS LINE SHOULD EXIST
#endif

#if ENABLED_DIRECTIVE
    THIS LINE SHOULD EXIST
#elif OTHER_SHIT
    THIS LINE SHOULD NOT EXIST
#elif MORE_SHIT
    THIS LINE SHOULD NOT EXIST
#else
    THIS LINE SHOULD NOT EXIST
#endif

#if (ENABLED_DIRECTIVE)
    THIS LINE SHOULD EXIST
#elif (OTHER_SHIT)
    THIS LINE SHOULD NOT EXIST
#elif (MORE_SHIT)
    THIS LINE SHOULD NOT EXIST
#else
    THIS LINE SHOULD NOT EXIST
#endif