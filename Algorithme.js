/*
  Returns the size of the call list.
  The call list size cannot change over time.

  Args :
  - S_w  : Size of the waiting list. It changes over time.
  - I_cl : Index of the current last proposition in the call 
  list. It changes over time.
  - I_c  : Index of your position in the call list. It changes
  over time.
*/
function call_list_size(S_w, I_cl, I_c)
{
    if(I_c > S_w + I_cl)
	return I_c;

    return Math.max(I_cl, S_w + I_cl + ((I_cl > I_c) ? I_cl - Ic + 1 : 0));
}



/* 
   Returns the current statistical probability of a candidate
   to accept a proposition.

   Args :
   - S_w  : Size of the waiting list. It changes over time.
   - I_cl : Index of the current last proposition in the call 
   list. It changes over time.
   - I_c  : Index of your position in the call list. It changes
   over time.
*/
function prob_accept_wish(S_w, I_cl, I_c)
{
    console.log("Taille liste d'appel            : " + call_list_size(S_w, I_cl, I_c));
    let r = I_cl / call_list_size(S_w, I_cl, I_c);
    return (r < 1) ? r : 1;
}



/*
  A simple factorial function.
*/
function factorial(n)
{
    let p = bigInt(n);
    return (p.lesserOrEquals(1)) ? p : p.multiply(factorial(p.subtract(1)));
}



/*
  A simple binomial coefficient function.
*/
function binomial_coefficient(n, k)
{
    return factorial(n).divide(factorial(k).multiply(factorial(n - k)));
}



/*
  A function which returns a {quotient, remainder} object.
*/
function multiply_bigint_with_float(bigint, float)
{
    console.log('----------------------------------------------------------------------');
    if('quotient' in bigint)
    {
	if(bigint.quotient.gt(1))
	    bigint = bigint.quotient;
	else
	    return bigint.remainder.divmod(1);
    }

    
    console.log("bigint : " + bigint.toString());
    let count = 0;
    let r = float;

    console.log("Original value : " + r);

    while(r % 1 > 0)
    {
	r *= 10;
	++count;
    }

    console.log("R : " + r);
    console.log("count : " + count);

    let step1 = bigint.multiply(r);
    console.log("2 step1 : " + step1.toString());
    let power = bigInt(10).pow(count);
    console.log("power : " + power);
    let step2 = step1.divmod(power);
    console.log("2 step2 : [" + step2.quotient.toString() + ", " + step2.remainder.toString() + "]");

    return step2;
}



/*
  A simple binomial law function.
*/
function binomial_law(n, p, k)
{
    let bin_coeff = binomial_coefficient(n, k);
    console.log("bin_coeff : " + bin_coeff.toString());

    let step1 = multiply_bigint_with_float(bin_coeff, Math.pow(p, k));
    console.log("step1 : " + step1);
    let step2 = multiply_bigint_with_float(step1, Math.pow((1 - p), (n - k)));
    step2 = parseFloat('0.' + step2.remainder.toString());
    console.log("step2 : " + step2);
    
    return step2;
}


/*
  Returns the current chance you have.

  Args :
  - I_w    : Index of the current position in the waiting list.
  - S_w    : Size of the waiting list. It changes over time.
  - I_cl   : Index of the current last proposition in the call 
  list. It changes over time.
  - I_c    : Index of your position in the call list. It changes
  over time.
*/
function assess_chance(I_w, S_w, I_cl, I_c)
{
    // Test args types.
    if(isNaN(I_w))
	throw "La position dans la file d'attente doit être un nombre.";
    if(isNaN(S_w))
	throw "Le nombre total de candidats dans la file d'attente doit être un nombre.";
    if(isNaN(I_cl))
	throw "La position dans la liste d'appel du dernier candidat qui a reçu une proposition d'admission doit être un nombre.";
    if(isNaN(I_c))
	throw "La position dans la liste d'appel doit être un nombre.";

    if(!Number.isInteger(I_w))
	throw "La position dans la file d'attente doit être un nombre entier.";
    if(!Number.isInteger(S_w))
	throw "Le nombre total de candidats dans la file d'attente doit être un nombre entier.";
    if(!Number.isInteger(I_cl))
	throw "La position dans la liste d'appel du dernier candidat qui a reçu une proposition d'admission doit être un nombre entier.";
    if(!Number.isInteger(I_c))
	throw "La position dans la liste d'appel doit être un nombre entier.";

    // Test conformity of args.
    if(I_w < 0)
	throw "La position dans la file d'attente doit être un nombre entier positif ou nul.";
    if(S_w < 0)
	throw "Le nombre total de candidats dans la file d'attente doit être un nombre entier positif ou nul.";
    if(I_cl < 0)
	throw "La position dans la liste d'appel du dernier candidat qui a reçu une proposition d'admission doit être un nombre entier positif ou nul.";
    if(I_c < 0)
	throw "La position dans la liste d'appel doit être un nombre entier positif ou nul.";

    if(I_w > S_w)
	throw "La position dans la file d'attente ne peut pas être plus grande que le nombre total de candidats dans la file d'attente.";
    if(I_cl > I_c)
	throw "La position dans la liste d'appel  du dernier candidat qui a reçu une proposition d'admission ne peut pas être plus grande que la position dans la liste d'appel.";

    if(I_c >= (S_w + (2 * I_cl) + 1))
	throw "Le nombre total de candidats dans la liste d'appel doit être un nombre entier strictement positif.";

    --I_w;
    --I_cl;
    --I_c;

    console.log("======================================================================");
    console.log("Position sur la liste d'attente : " + I_w);
    console.log("Taille de la file d'attente     : " + S_w);
    console.log("Position dans liste d'appel     : " + I_c);
    console.log("Position dernier admis appel    : " + I_cl);

    if(I_w == 0)
	return 1;

    let prob = prob_accept_wish(S_w, I_cl, I_c);
    console.log("prob : " + prob);
    return binomial_law(S_w, prob, I_w) * 100;
}
